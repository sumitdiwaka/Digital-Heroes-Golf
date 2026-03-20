const Winner = require('../models/Winner');
const User = require('../models/User');
const { sendPayoutEmail } = require('../utils/emailService');

// @desc    Get current user's winnings
// @route   GET /api/winners/my-winnings
const getMyWinnings = async (req, res) => {
  try {
    const winners = await Winner.find({ user: req.user._id })
      .populate('draw', 'month year drawnNumbers')
      .sort({ createdAt: -1 });
    res.json({ success: true, winners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    User uploads proof screenshot
// @route   POST /api/winners/:id/upload-proof
const uploadProof = async (req, res) => {
  try {
    const { proofImageUrl } = req.body;
    const winner = await Winner.findOne({ _id: req.params.id, user: req.user._id });

    if (!winner) {
      return res.status(404).json({ success: false, message: 'Winner record not found' });
    }

    winner.proofImageUrl = proofImageUrl;
    winner.verificationStatus = 'pending';
    await winner.save();

    res.json({ success: true, winner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin — Get all winners
// @route   GET /api/winners
const getAllWinners = async (req, res) => {
  try {
    const winners = await Winner.find()
      .populate('user', 'name email')
      .populate('draw', 'month year drawnNumbers')
      .sort({ createdAt: -1 });
    res.json({ success: true, winners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin — Approve or reject winner verification
// @route   PUT /api/winners/:id/verify
const verifyWinner = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const winner = await Winner.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: status, adminNote: adminNote || '' },
      { new: true }
    ).populate('user', 'name email');

    res.json({ success: true, winner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin — Mark winner as paid
// @route   PUT /api/winners/:id/mark-paid
const markAsPaid = async (req, res) => {
  try {
    const winner = await Winner.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: 'paid', paidAt: new Date() },
      { new: true }
    ).populate('user', 'name email');

    if (!winner) {
      return res.status(404).json({ success: false, message: 'Winner not found' });
    }

    const user = await User.findById(winner.user._id);
    if (user) await sendPayoutEmail(user, winner.prizeAmount);

    res.json({ success: true, winner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyWinnings, uploadProof, getAllWinners, verifyWinner, markAsPaid };