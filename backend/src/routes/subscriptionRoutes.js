const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  handleWebhook,
  getMySubscription,
  cancelSubscription,
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

// Webhook — raw body (handled in app.js before express.json)
router.post('/webhook', handleWebhook);

router.post('/create-checkout', protect, createCheckoutSession);
router.get('/my-subscription', protect, getMySubscription);
router.post('/cancel', protect, cancelSubscription);

module.exports = router;