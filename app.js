const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Import Routes
const userRoutes = require('./src/routes/userRoutes');
const donationRoutes = require('./src/routes/donationRoutes');
const fundingRoutes = require('./src/routes/fundingRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// --- Middleware Configuration ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174', // আপনার বর্তমান ফ্রন্টএন্ড পোর্টটি যোগ করা হলো
  'http://localhost:5181',
  'http://localhost:5182',
  'https://blood-donationbd.netlify.app',
  process.env.CLIENT_URL 
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // origin না থাকলে (যেমন Postman) অথবা localhost দিয়ে শুরু হলে অথবা লিস্টে থাকলে অনুমতি দাও
    if (!origin || origin.startsWith('http://localhost:') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // লগে এররটি স্পষ্টভাবে দেখার জন্য অরিজিনসহ মেসেজ
      callback(new Error(`Not allowed by CORS at origin: ${origin}`));
    }
  },
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB 
connectDB();

// --- Routes Configuration ---
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/fundings', fundingRoutes);
app.use('/api/admin', adminRoutes);

// Default Root Route
app.get('/', (req, res) => {
  res.send('Blood Donation Full API is running! MongoDB Connected!');
});

// Error handling middleware (সার্ভার যাতে হুট করে ক্রাশ না করে)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

module.exports = app;