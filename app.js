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
  'http://localhost:5181',
  'http://localhost:5182',
  'https://blood-donationbd.netlify.app', // আপনার লাইভ লিঙ্ক [cite: 256]
  process.env.CLIENT_URL 
].filter(Boolean); // undefined ভ্যালু রিমুভ করার জন্য

app.use(cors({
  origin: function (origin, callback) {
    // origin না থাকলে (যেমন Postman) বা allowedOrigins এ থাকলে অনুমতি দাও [cite: 26]
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
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
app.use('/api/admin', adminRoutes); // অ্যাডমিন ড্যাশবোর্ড স্ট্যাটাসের জন্য [cite: 121]

// Default Root Route
app.get('/', (req, res) => {
  res.send('Blood Donation Full API is running! MongoDB Connected!');
});

module.exports = app;