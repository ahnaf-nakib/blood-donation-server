const express = require('express');
const {
  createDonationRequest,
  getMyRequests,
  getAllRequests,
  getPendingRequests,
  updateRequest,
  deleteRequest,
  donateToRequest,
  updateDonationStatus,
  getDonationDetails
} = require('../controllers/donationController');

const { authMiddleware, volunteerOrAdmin } = require('../middlewares/auth');

const router = express.Router();

// Create donation request
router.post('/create', authMiddleware, createDonationRequest);

// Logged-in user's requests
router.get('/my', authMiddleware, getMyRequests);

// All requests (Admin / Volunteer)
router.get('/all', authMiddleware, volunteerOrAdmin, getAllRequests);

// Pending requests (Public)
router.get('/pending', getPendingRequests);

// Update request
router.put('/update/:id', authMiddleware, updateRequest);

// Delete request
router.delete('/delete/:id', authMiddleware, deleteRequest);

// Donate to a request
router.put('/donate/:id', authMiddleware, donateToRequest);

// Update donation status (done / canceled)
router.put('/status/:id', authMiddleware, updateDonationStatus);

// Get donation request details by ID
router.get('/:id', authMiddleware, getDonationDetails);

module.exports = router;
