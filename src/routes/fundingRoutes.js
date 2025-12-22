const express = require('express');
const { createPaymentIntent, saveFunding, getAllFundings } = require('../controllers/fundingController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.post('/create-intent', authMiddleware, createPaymentIntent);
router.post('/save', authMiddleware, saveFunding);
router.get('/all', authMiddleware, getAllFundings);

module.exports = router;