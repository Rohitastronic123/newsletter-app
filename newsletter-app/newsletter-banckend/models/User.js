const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  role: { type: String,
     enum: ['free', 'premium'], 
     default: 'free' },
premiumExpiresAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
