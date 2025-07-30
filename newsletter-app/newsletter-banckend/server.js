const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
// const stripeWebhook = require('./routes/stripeWebhook');
const subscriptionRoutes = require('./routes/subscription');
const newsletters = require('./routes/newsletters');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
// app.use('/api/stripe', stripeWebhook);
app.use('/api/newsletters',newsletters)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.get('/api', (req, res) => {
  res.send('API Running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
