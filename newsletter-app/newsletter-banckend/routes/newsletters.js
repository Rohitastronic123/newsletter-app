const express = require('express');
const router = express.Router();
const { getNewsletters } = require('../controllers/newsletterController');
const auth = require('../middleware/authMiddleware');
const checkSubscription = require('../middleware/checkSubscription'); // <--- Add this

// Apply both middlewares before fetching newsletters
router.get('/', auth, checkSubscription, getNewsletters);

module.exports = router;
