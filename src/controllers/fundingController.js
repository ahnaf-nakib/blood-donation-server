const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Funding = require('../models/Funding');
const User = require('../models/User');

// ===============================
// Create Payment Intent
// ===============================
const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    // ✅ amount already in cents
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // ✅ NO multiplication here
      currency: 'usd',
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// Save Funding Info
// ===============================
const saveFunding = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const funding = new Funding({
      donorName: user.name,
      donorEmail: user.email,
      amount: req.body.amount // ✅ USD amount
    });

    await funding.save();
    res.status(201).json(funding);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// Get All Fundings
// ===============================
const getAllFundings = async (req, res) => {
  try {
    const fundings = await Funding.find().sort({ date: -1 });

    const totalFunds = await Funding.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      fundings,
      total: totalFunds[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPaymentIntent,
  saveFunding,
  getAllFundings
};
