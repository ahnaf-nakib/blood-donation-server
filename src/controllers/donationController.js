const DonationRequest = require('../models/DonationRequest');
const User = require('../models/User');

const createDonationRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Blocked users cannot create requests' });
    }

    const request = new DonationRequest({
      requester: {
        id: req.user.id,
        name: user.name,
        email: user.email
      },
      ...req.body
    });

    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await DonationRequest
      .find({ 'requester.id': req.user.id })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const requests = await DonationRequest.find(query).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const requests = await DonationRequest
      .find({ status: 'pending' })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDonationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await DonationRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Donation request not found' });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await DonationRequest.findByIdAndUpdate(id, req.body, { new: true });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await DonationRequest.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const donateToRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const request = await DonationRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'inprogress',
        donor: {
          id: req.user.id,
          name: user.name,
          email: user.email
        }
      },
      { new: true }
    );

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await DonationRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createDonationRequest,
  getMyRequests,
  getAllRequests,
  getPendingRequests,
  getDonationDetails,
  updateRequest,
  deleteRequest,
  donateToRequest,
  updateDonationStatus
};
