const express = require('express');
const router = express.Router();
const {
  getCharities,
  getFeaturedCharities,
  getCharityById,
  createCharity,
  updateCharity,
  deleteCharity,
} = require('../controllers/charityController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getCharities);
router.get('/featured', getFeaturedCharities);
router.get('/:id', getCharityById);

// Admin only
router.post('/', protect, adminOnly, createCharity);
router.put('/:id', protect, adminOnly, updateCharity);
router.delete('/:id', protect, adminOnly, deleteCharity);

module.exports = router;