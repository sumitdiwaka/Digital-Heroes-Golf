const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema(
  {
    month: {
      type: Number, // 1-12
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    drawType: {
      type: String,
      enum: ['random', 'algorithmic'],
      default: 'random',
    },
    drawnNumbers: {
      type: [Number], // 5 numbers drawn
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'simulated', 'published'],
      default: 'pending',
    },
    totalPrizePool: {
      type: Number,
      default: 0,
    },
    // Pool breakdown
    pool5Match: { type: Number, default: 0 },  // 40%
    pool4Match: { type: Number, default: 0 },  // 35%
    pool3Match: { type: Number, default: 0 },  // 25%

    // Jackpot rollover from previous month
    jackpotRollover: {
      type: Number,
      default: 0,
    },
    // Flag if 5-match jackpot was unclaimed (rolls to next month)
    jackpotRolledOver: {
      type: Boolean,
      default: false,
    },
    participantCount: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Unique draw per month/year
drawSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Draw', drawSchema);