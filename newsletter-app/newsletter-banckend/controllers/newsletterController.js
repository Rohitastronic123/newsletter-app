// controllers/newsletterController.js
const Newsletter = require('../models/Newsletter');

exports.getNewsletters = async (req, res) => {
  try {
    const role = req.user?.role || 'free';

    let newsletters;

    if (role === 'premium') {
      // Premium users see all details
      newsletters = await Newsletter.find({});
    } else {
      // Free users:
      const free = await Newsletter.find({ type: 'free' }); // full details
      const premium = await Newsletter.find({ type: 'premium' }).select('title type'); // only titles

      newsletters = [...free, ...premium];
    }

    res.json({ success: true, data: newsletters });
  } catch (err) {
    console.error("Error fetching newsletters:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
