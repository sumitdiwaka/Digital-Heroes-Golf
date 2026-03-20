const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { sendSubscriptionEmail } = require('../utils/emailService');
const {
  calculateCharityContribution,
  calculatePrizePoolContribution,
} = require('../utils/prizeCalculator');

const PLANS = {
  monthly: { priceId: process.env.STRIPE_MONTHLY_PRICE_ID, amount: 999 },
  yearly:  { priceId: process.env.STRIPE_YEARLY_PRICE_ID,  amount: 9999 },
};

// @desc    Create Stripe checkout session
// @route   POST /api/subscriptions/create-checkout
const createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    let customerId = req.user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: { userId: req.user._id.toString() },
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(req.user._id, { stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
      success_url: process.env.CLIENT_URL + '/dashboard?subscribed=true',
      cancel_url: process.env.CLIENT_URL + '/subscribe?cancelled=true',
      metadata: {
        userId: req.user._id.toString(),
        plan,
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/subscriptions/webhook
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ message: 'Webhook Error: ' + err.message });
  }

  const data = event.data.object;

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const userId = data.metadata.userId;
        const plan = data.metadata.plan;
        const stripeSubId = data.subscription;
        const customerId = data.customer;

        // Retrieve full subscription object from Stripe
        const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);

        const amount = PLANS[plan] ? PLANS[plan].amount / 100 : 9.99;
        const charityContrib = calculateCharityContribution(amount, 10);
        const prizeContrib = calculatePrizePoolContribution(amount, 10);

        // Safely extract period dates — handle both old and new Stripe API formats
        let periodStart = null;
        let periodEnd = null;

        // New Stripe API (2026+) uses items.data[0].current_period_*
        if (
          stripeSub.items &&
          stripeSub.items.data &&
          stripeSub.items.data[0]
        ) {
          const item = stripeSub.items.data[0];
          if (item.current_period_start) {
            periodStart = new Date(item.current_period_start * 1000);
          }
          if (item.current_period_end) {
            periodEnd = new Date(item.current_period_end * 1000);
          }
        }

        // Fallback to top-level (older Stripe API format)
        if (!periodStart && stripeSub.current_period_start) {
          periodStart = new Date(stripeSub.current_period_start * 1000);
        }
        if (!periodEnd && stripeSub.current_period_end) {
          periodEnd = new Date(stripeSub.current_period_end * 1000);
        }

        // Final fallback — use reasonable defaults
        if (!periodStart || isNaN(periodStart.getTime())) {
          periodStart = new Date();
        }
        if (!periodEnd || isNaN(periodEnd.getTime())) {
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + (plan === 'yearly' ? 12 : 1));
          periodEnd = endDate;
        }

        await Subscription.create({
          user: userId,
          plan,
          amount,
          status: 'active',
          stripeSubscriptionId: stripeSubId,
          stripeCustomerId: customerId,
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          charityContribution: charityContrib,
          prizePoolContribution: prizeContrib,
        });

        await User.findByIdAndUpdate(userId, {
          subscriptionStatus: 'active',
          subscriptionPlan: plan,
          stripeSubscriptionId: stripeSubId,
          stripeCustomerId: customerId,
          subscriptionRenewalDate: periodEnd,
        });

        const user = await User.findById(userId);
        if (user) await sendSubscriptionEmail(user, plan);
        break;
      }

      case 'customer.subscription.deleted': {
        await User.findOneAndUpdate(
          { stripeSubscriptionId: data.id },
          { subscriptionStatus: 'cancelled', subscriptionPlan: null }
        );
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: data.id },
          { status: 'cancelled', cancelledAt: new Date() }
        );
        break;
      }

      case 'invoice.payment_failed': {
        await User.findOneAndUpdate(
          { stripeCustomerId: data.customer },
          { subscriptionStatus: 'lapsed' }
        );
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error('Webhook handler error:', err.message);
  }

  res.json({ received: true });
};

// @desc    Get current user subscription
// @route   GET /api/subscriptions/my-subscription
const getMySubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id, status: 'active' });
    res.json({ success: true, subscription: sub });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel subscription
// @route   POST /api/subscriptions/cancel
const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ success: false, message: 'No active subscription' });
    }

    await stripe.subscriptions.cancel(user.stripeSubscriptionId);

    await User.findByIdAndUpdate(req.user._id, {
      subscriptionStatus: 'cancelled',
      subscriptionPlan: null,
    });

    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: user.stripeSubscriptionId },
      { status: 'cancelled', cancelledAt: new Date() }
    );

    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
  getMySubscription,
  cancelSubscription,
};