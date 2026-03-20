const express = require('express');
const router = express.Router();
const {
  getMyWinnings,
  uploadProof,
  getAllWinners,
  verifyWinner,
  markAsPaid,
} = require('../controllers/winnerController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/my-winnings', protect, getMyWinnings);
router.post('/:id/upload-proof', protect, uploadProof);

// Admin only
router.get('/', protect, adminOnly, getAllWinners);
router.put('/:id/verify', protect, adminOnly, verifyWinner);
router.put('/:id/mark-paid', protect, adminOnly, markAsPaid);

module.exports = router;