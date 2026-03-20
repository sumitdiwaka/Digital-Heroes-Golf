const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema(
  {
    draw: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Draw',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    matchType: {
      type: String,
      enum: ['5-match', '4-match', '3-match'],
      required: true,
    },
    matchedNumbers: {
      type: [Number],
      required: true,
    },
    prizeAmount: {
      type: Number,
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    proofImageUrl: {
      type: String,
      default: null,
    },
    adminNote: {
      type: String,
      default: '',
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Winner', winnerSchema);