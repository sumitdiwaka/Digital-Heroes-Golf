const express = require('express');
const router = express.Router();
const { addScore, getMyScores, editScore, deleteScore } = require('../controllers/scoreController');
const { protect } = require('../middleware/authMiddleware');
const { subscribersOnly } = require('../middleware/subscriptionMiddleware');

router.use(protect, subscribersOnly);

router.get('/', getMyScores);
router.post('/', addScore);
router.put('/:scoreId', editScore);
router.delete('/:scoreId', deleteScore);

module.exports = router;