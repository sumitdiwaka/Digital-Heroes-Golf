const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  editUser,
  editUserScores,
  updateUserSubscription,
  getReports,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.put('/users/:id', editUser);
router.put('/users/:id/scores', editUserScores);
router.put('/users/:id/subscription', updateUserSubscription);
router.get('/reports', getReports);

module.exports = router;