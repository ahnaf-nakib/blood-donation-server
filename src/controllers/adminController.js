const User = require('../models/User');
const DonationRequest = require('../models/DonationRequest');

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'donor' });
    const totalRequests = await DonationRequest.countDocuments();
    const totalFunding = 0; // future use

    res.json({
      totalUsers,
      totalRequests,
      totalFunding
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAdminStats };
