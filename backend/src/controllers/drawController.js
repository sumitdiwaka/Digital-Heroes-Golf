const Draw = require('../models/Draw');
const Score = require('../models/Score');
const Winner = require('../models/Winner');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { randomDraw, algorithmicDraw, checkUserMatch, getMatchType } = require('../utils/drawEngine');
const { calculatePools, splitPrize } = require('../utils/prizeCalculator');
const { sendDrawResultEmail } = require('../utils/emailService');

// @desc    Get all published draws (public)
// @route   GET /api/draws
const getDraws = async (req, res) => {
  try {
    // Return all draws (admin needs to see pending/simulated too)
    const draws = await Draw.find({}).sort({ year: -1, month: -1 });
    res.json({ success: true, draws });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current month draw info
// @route   GET /api/draws/current
const getCurrentDraw = async (req, res) => {
  try {
    const now = new Date();
    const draw = await Draw.findOne({ month: now.getMonth() + 1, year: now.getFullYear() });
    res.json({ success: true, draw });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin — Create/configure draw for month
// @route   POST /api/draws/configure
const configureDraw = async (req, res) => {
  try {
    const { month, year, drawType, jackpotRollover } = req.body;

    // Calculate total prize pool from active subscriptions
    const activeSubs = await Subscription.find({ status: 'active' });
    const totalPool = activeSubs.reduce((sum, s) => sum + s.prizePoolContribution, 0);

    const pools = calculatePools(totalPool, jackpotRollover || 0);

    const existing = await Draw.findOne({ month, year });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Draw already configured for this month' });
    }

    const draw = await Draw.create({
      month,
      year,
      drawType: drawType || 'random',
      totalPrizePool: totalPool,
      ...pools,
      jackpotRollover: jackpotRollover || 0,
      participantCount: activeSubs.length,
    });

    res.status(201).json({ success: true, draw });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin — Run draw simulation (does not publish)
// @route   POST /api/draws/:id/simulate
const simulateDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });

    const numbers =
      draw.drawType === 'algorithmic'
        ? await algorithmicDraw()
        : randomDraw();

    draw.drawnNumbers = numbers;
    draw.status = 'simulated';
    await draw.save();

    res.json({ success: true, draw, message: 'Simulation complete. Review before publishing.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin — Publish draw and create winners
// @route   POST /api/draws/:id/publish
const publishDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });
    if (draw.status === 'published') {
      return res.status(400).json({ success: false, message: 'Draw already published' });
    }

    // If no simulation yet, run draw now
    if (!draw.drawnNumbers || draw.drawnNumbers.length === 0) {
      draw.drawnNumbers =
        draw.drawType === 'algorithmic'
          ? await algorithmicDraw()
          : randomDraw();
    }

    // Get all active subscribers with scores
    const activeUsers = await User.find({ subscriptionStatus: 'active' });

    const winners5 = [];
    const winners4 = [];
    const winners3 = [];

    for (const user of activeUsers) {
      const scoreDoc = await Score.findOne({ user: user._id });
      if (!scoreDoc || scoreDoc.scores.length === 0) continue;

      const matched = checkUserMatch(scoreDoc.scores, draw.drawnNumbers);
      const matchType = getMatchType(matched.length);

      if (matchType) {
        const winnerData = { draw: draw._id, user: user._id, matchType, matchedNumbers: matched, prizeAmount: 0 };
        if (matchType === '5-match') winners5.push(winnerData);
        if (matchType === '4-match') winners4.push(winnerData);
        if (matchType === '3-match') winners3.push(winnerData);
      }
    }

    // Handle jackpot rollover if no 5-match winners
    let jackpotRolledOver = false;
    if (winners5.length === 0) {
      jackpotRolledOver = true;
    }

    // Calculate individual prize amounts
    const prize5 = splitPrize(draw.pool5Match, winners5.length);
    const prize4 = splitPrize(draw.pool4Match, winners4.length);
    const prize3 = splitPrize(draw.pool3Match, winners3.length);

    const allWinners = [
      ...winners5.map((w) => ({ ...w, prizeAmount: prize5 })),
      ...winners4.map((w) => ({ ...w, prizeAmount: prize4 })),
      ...winners3.map((w) => ({ ...w, prizeAmount: prize3 })),
    ];

    // Save winners
    for (const w of allWinners) {
      const winner = await Winner.create(w);
      const user = await User.findById(w.user);
      await User.findByIdAndUpdate(w.user, { $inc: { totalWinnings: w.prizeAmount } });
      if (user) await sendDrawResultEmail(user, w.matchType, w.prizeAmount);
    }

    draw.status = 'published';
    draw.jackpotRolledOver = jackpotRolledOver;
    draw.publishedAt = new Date();
    await draw.save();

    res.json({
      success: true,
      draw,
      winnersCreated: allWinners.length,
      jackpotRolledOver,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDraws, getCurrentDraw, configureDraw, simulateDraw, publishDraw };