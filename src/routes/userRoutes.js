const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  updateUserRole,
  toggleBlockUser,
  updateProfile,
  searchDonors
} = require('../controllers/userController');

const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Admin-only routes
router.get('/all', authMiddleware, adminMiddleware, getAllUsers);
router.put('/role/:id', authMiddleware, adminMiddleware, updateUserRole);
router.put('/block/:id', authMiddleware, adminMiddleware, toggleBlockUser);

// Profile update
router.put('/profile/:id', authMiddleware, updateProfile);

// ✅ Public search route (no auth)
router.get('/search', searchDonors);

module.exports = router;
