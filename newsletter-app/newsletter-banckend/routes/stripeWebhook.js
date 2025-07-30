// routes/webhook.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Only handle successful payments
  if (event.type === 'payment_intent.succeeded') {
    const metadata = event.data.object.metadata;
    console.log("✅ Webhook: Payment succeeded for userId:", metadata.userId);

    try {
      const user = await User.findById(metadata.userId);
      if (user) {
        user.role = 'premium';
        user.premiumExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await user.save();
        console.log(`🎉 User ${user.email} upgraded to premium`);
      } else {
        console.warn("⚠️ Webhook: No user found for userId", metadata.userId);
      }
    } catch (err) {
      console.error("❌ Webhook user upgrade failed:", err);
    }
  }

  res.send({ received: true });
});


module.exports = router;
