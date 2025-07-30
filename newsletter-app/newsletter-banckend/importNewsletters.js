// importNewsletters.js
const mongoose = require('mongoose');
const csv = require('csvtojson');
const Newsletter = require('./models/Newsletter');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/newsletter';

async function importData() {
  await mongoose.connect(MONGO_URI);
  const jsonArray = await csv().fromFile('newsletters.csv');
  await Newsletter.insertMany(jsonArray);
  console.log("✅ Newsletters imported successfully");
  process.exit();
}

importData().catch(err => {
  console.error("❌ Failed to import:", err);
});
