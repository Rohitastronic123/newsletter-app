const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
    
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'premium' && user.premiumExpiresAt) {
      const now = new Date();
      const expiry = new Date(user.premiumExpiresAt);


      if (now > expiry) {
    
        user.role = 'free';
        user.premiumExpiresAt = null;
        await user.save();

     
        req.user.role = 'free';

        
      } else {
       
      }
    } 

    next();
  } catch (err) {
    console.error("❌ Subscription check error:", err);
    return res.status(500).json({ success: false, message: 'Subscription validation failed' });
  }
};
