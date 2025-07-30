const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  upgradeToPremium,
  confirmUpgrade,
  renewPremium
} = require('../controllers/authController');

router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to protected route',
    userId: req.user.id,
    user:req.user
  });
});
router.post('/upgrade', authMiddleware, upgradeToPremium);
router.post('/confirm-upgrade', authMiddleware, confirmUpgrade);
router.post('/renew', authMiddleware, renewPremium);

module.exports = router;
