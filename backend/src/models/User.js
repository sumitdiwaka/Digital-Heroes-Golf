const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    selectedCharity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Charity',
      default: null,
    },
    charityPercentage: {
      type: Number,
      default: 10, // Minimum 10% as per PRD
      min: 10,
      max: 100,
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'lapsed', 'cancelled'],
      default: 'inactive',
    },
    subscriptionPlan: {
      type: String,
      enum: ['monthly', 'yearly', null],
      default: null,
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    stripeSubscriptionId: {
      type: String,
      default: null,
    },
    subscriptionRenewalDate: {
      type: Date,
      default: null,
    },
    totalWinnings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);