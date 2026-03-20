const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Draw = require('../models/Draw');
const Winner = require('../models/Winner');
const Charity = require('../models/Charity');
const Score = require('../models/Score');

// @desc    Admin — Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('selectedCharity', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin — Edit user profile
// @route   PUT /api/admin/users/:id
const editUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin — Edit a user's golf scores
// @route   PUT /api/admin/users/:id/scores
const editUserScores = async (req, res) => {
  try {
    const { scores } = req.body;
    const scoreDoc = await Score.findOneAndUpdate(
      { user: req.params.id },
      { scores },
      { new: true, upsert: true }
    );
    res.json({ success: true, scores: scoreDoc.scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin — Manage subscription status manually
// @route   PUT /api/admin/users/:id/subscription
const updateUserSubscription = async (req, res) => {
  try {
    const { subscriptionStatus, subscriptionPlan } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { subscriptionStatus, subscriptionPlan },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin — Get analytics/reports
// @route   GET /api/admin/reports
const getReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeSubscribers = await User.countDocuments({ subscriptionStatus: 'active' });

    const prizePoolData = await Subscription.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          totalPrizePool: { $sum: '$prizePoolContribution' },
          totalCharityContributions: { $sum: '$charityContribution' },
        },
      },
    ]);

    const drawStats = await Draw.find({ status: 'published' })
      .select('month year totalPrizePool participantCount jackpotRolledOver')
      .sort({ year: -1, month: -1 });

    const charityTotals = await User.aggregate([
      { $match: { subscriptionStatus: 'active' } },
      { $lookup: { from: 'charities', localField: 'selectedCharity', foreignField: '_id', as: 'charity' } },
      { $unwind: { path: '$charity', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$charity.name',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      reports: {
        totalUsers,
        activeSubscribers,
        totalPrizePool: prizePoolData[0]?.totalPrizePool || 0,
        totalCharityContributions: prizePoolData[0]?.totalCharityContributions || 0,
        drawStats,
        charityTotals,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  editUser,
  editUserScores,
  updateUserSubscription,
  getReports,
};