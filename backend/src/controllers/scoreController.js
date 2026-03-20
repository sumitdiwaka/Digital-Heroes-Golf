const Score = require('../models/Score');

// @desc    Add a new score (rolling 5 — replaces oldest)
// @route   POST /api/scores
const addScore = async (req, res) => {
  try {
    const { value, date } = req.body;

    if (!value || !date) {
      return res.status(400).json({ success: false, message: 'Score value and date are required' });
    }

    if (value < 1 || value > 45) {
      return res.status(400).json({ success: false, message: 'Score must be between 1 and 45 (Stableford)' });
    }

    let scoreDoc = await Score.findOne({ user: req.user._id });

    if (!scoreDoc) {
      // First time — create new document
      scoreDoc = await Score.create({
        user: req.user._id,
        scores: [{ value, date }],
      });
    } else {
      // Rolling logic — if 5 already, remove oldest before adding
      if (scoreDoc.scores.length >= 5) {
        // Sort by date ascending, remove the oldest
        scoreDoc.scores.sort((a, b) => new Date(a.date) - new Date(b.date));
        scoreDoc.scores.shift(); // remove oldest
      }
      scoreDoc.scores.push({ value, date });
      // Sort by date descending (most recent first) for display
      scoreDoc.scores.sort((a, b) => new Date(b.date) - new Date(a.date));
      await scoreDoc.save();
    }

    res.status(201).json({ success: true, scores: scoreDoc.scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's scores
// @route   GET /api/scores
const getMyScores = async (req, res) => {
  try {
    const scoreDoc = await Score.findOne({ user: req.user._id });
    const scores = scoreDoc ? scoreDoc.scores : [];
    res.json({ success: true, scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Edit a specific score by its _id
// @route   PUT /api/scores/:scoreId
const editScore = async (req, res) => {
  try {
    const { value, date } = req.body;
    const { scoreId } = req.params;

    if (value && (value < 1 || value > 45)) {
      return res.status(400).json({ success: false, message: 'Score must be between 1 and 45' });
    }

    const scoreDoc = await Score.findOne({ user: req.user._id });
    if (!scoreDoc) {
      return res.status(404).json({ success: false, message: 'No scores found' });
    }

    const entry = scoreDoc.scores.id(scoreId);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Score entry not found' });
    }

    if (value) entry.value = value;
    if (date) entry.date = date;

    // Re-sort after edit
    scoreDoc.scores.sort((a, b) => new Date(b.date) - new Date(a.date));
    await scoreDoc.save();

    res.json({ success: true, scores: scoreDoc.scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a specific score
// @route   DELETE /api/scores/:scoreId
const deleteScore = async (req, res) => {
  try {
    const { scoreId } = req.params;
    const scoreDoc = await Score.findOne({ user: req.user._id });

    if (!scoreDoc) {
      return res.status(404).json({ success: false, message: 'No scores found' });
    }

    scoreDoc.scores = scoreDoc.scores.filter(
      (s) => s._id.toString() !== scoreId
    );
    await scoreDoc.save();

    res.json({ success: true, scores: scoreDoc.scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addScore, getMyScores, editScore, deleteScore };