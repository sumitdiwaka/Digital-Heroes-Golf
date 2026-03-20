const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
    },
    amount: {
      type: Number,
      required: true, // In pence/cents
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'lapsed', 'past_due'],
      default: 'active',
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    currentPeriodStart: {
      type: Date,
    },
    currentPeriodEnd: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    charityContribution: {
      type: Number, // Calculated amount going to charity
      default: 0,
    },
    prizePoolContribution: {
      type: Number, // Calculated amount going to prize pool
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);