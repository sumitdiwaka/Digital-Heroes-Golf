const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Charity name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    upcomingEvents: [
      {
        title: { type: String },
        date: { type: Date },
        description: { type: String },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    totalReceived: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Charity', charitySchema);