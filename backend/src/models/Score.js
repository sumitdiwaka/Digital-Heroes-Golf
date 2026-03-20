const mongoose = require('mongoose');

// Each entry = one score with its date
const scoreEntrySchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
      min: [1, 'Score must be at least 1'],
      max: [45, 'Score cannot exceed 45'],
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { _id: true }
);

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One score document per user
    },
    // Rolling array — max 5 scores, most recent first
    scores: {
      type: [scoreEntrySchema],
      validate: {
        validator: function (arr) {
          return arr.length <= 5;
        },
        message: 'Only 5 scores can be stored at a time',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Score', scoreSchema);