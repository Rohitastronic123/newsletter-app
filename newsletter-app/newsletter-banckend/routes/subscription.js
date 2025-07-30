// routes/user.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent with userId in metadata
router.post('/upgrade', auth, async (req, res) => {
  try {
    // Log the authenticated user
    console.log('🔐 Authenticated User:', req.user);

    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 99900, // ₹999 in paise
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: req.user.id, // ✅ Webhook will use this
      },
    });

    // Log the generated client secret and metadata
    console.log('💳 Created PaymentIntent:', {
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      metadata: paymentIntent.metadata,
    });

    res.json({
      success: true,
      message: 'Complete payment to renew premium',
      clientSecret: paymentIntent.client_secret,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (err) {
    console.error('❌ Failed to initiate renewal:', err);
    res.status(500).json({ success: false, message: 'Failed to initiate renewal' });
  }
});

module.exports = router;
