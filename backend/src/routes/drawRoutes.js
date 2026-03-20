const express = require('express');
const router = express.Router();
const {
  getDraws,
  getCurrentDraw,
  configureDraw,
  simulateDraw,
  publishDraw,
} = require('../controllers/drawController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getDraws);
router.get('/current', getCurrentDraw);

// Admin only
router.post('/configure', protect, adminOnly, configureDraw);
router.post('/:id/simulate', protect, adminOnly, simulateDraw);
router.post('/:id/publish', protect, adminOnly, publishDraw);

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await require('../models/Draw').findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Draw deleted' })
  } catch(e) {
    res.status(500).json({ success: false, message: e.message })
  }
})

module.exports = router;