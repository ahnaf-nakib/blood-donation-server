const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Import Routes
const userRoutes = require('./src/routes/userRoutes');
const donationRoutes = require('./src/routes/donationRoutes');
const fundingRoutes = require('./src/routes/fundingRoutes');
// অ্যাডমিন রাউটটি এখানে ইম্পোর্ট করুন
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// --- Middleware Configuration ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5181',
  'http://localhost:5182',
  process.env.CLIENT_URL 
];

app.use(cors({
  origin: function (origin, callback) {
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

// অ্যাডমিন স্ট্যাটাস এপিআই এর জন্য সঠিক পাথ সেট করুন
app.use('/api/admin', adminRoutes); 

// Temporary test route
app.get('/', (req, res) => {
  res.send('Blood Donation Full API is running! MongoDB Connected!');
});

module.exports = app;