const express = require('express');
const router = express.Router();

const { getAdminStats } = require('../controllers/adminController');
const {
  authMiddleware,
  adminMiddleware,
  volunteerOrAdmin
} = require('../middlewares/auth');

// ✅ Admin + Volunteer both can access
router.get(
  '/stats',
  authMiddleware,
  volunteerOrAdmin,
  getAdminStats
);

module.exports = router;
