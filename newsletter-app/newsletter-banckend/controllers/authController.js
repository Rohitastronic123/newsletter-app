const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Stripe setup
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  if (role === 'premium') {
    // Do NOT save user yet

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 99900, // in paisa/cents (₹999.00)
      currency: 'inr',
      metadata: { name, email, password } // temp store
    });

    return res.json({
      success: true,
      message: "Complete payment to finish premium registration",
      clientSecret: paymentIntent.client_secret,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  }

  // Free users can register immediately
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role: 'free' });
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ success: true, token, role: user.role });
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ Error in loginUser:", err); 
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// controllers/userController.js
exports.upgradeToPremium = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    console.log('🔐 Authenticated User:', req.user);

    if (!user) return res.status(404).json({ message: "User not found" });

        const paymentIntent = await stripe.paymentIntents.create({
      amount: 99900, // ₹999 in paise
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: userId, // ✅ Webhook will use this
      },
    });


    return res.json({
      success: true,
      message: "Complete payment to upgrade to premium",
      clientSecret: paymentIntent.client_secret,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (err) {
    console.error("Upgrade Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.confirmUpgrade = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (intent.status !== 'succeeded') {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    const userId = intent.metadata.userId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = 'premium';
    user.premiumExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await user.save();

    res.json({ success: true, message: "Upgraded to premium successfully" });
  } catch (err) {
    console.error("Confirm Upgrade Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.renewPremium = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: "User not found" });

      const paymentIntent = await stripe.paymentIntents.create({
      amount: 99900, // ₹999 in paise
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: req.user.id, // ✅ Webhook will use this
      },
    });


  res.json({
    success: true,
    message: "Complete payment to renew premium",
    clientSecret: paymentIntent.client_secret,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
};
