const Score = require('../models/Score');

/**
 * Random Draw — standard lottery style
 * Picks 5 unique numbers from range 1–45 (Stableford range)
 */
const randomDraw = () => {
  const numbers = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

/**
 * Algorithmic Draw — weighted by frequency of user scores
 * Most frequent scores have higher probability of being drawn
 */
const algorithmicDraw = async () => {
  // Aggregate all score values across all users
  const scoreData = await Score.aggregate([
    { $unwind: '$scores' },
    {
      $group: {
        _id: '$scores.value',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  if (scoreData.length < 5) {
    // Fallback to random if not enough data
    return randomDraw();
  }

  // Build weighted pool
  const weightedPool = [];
  scoreData.forEach((item) => {
    for (let i = 0; i < item.count; i++) {
      weightedPool.push(item._id);
    }
  });

  // Pick 5 unique numbers from weighted pool
  const picked = new Set();
  let attempts = 0;
  while (picked.size < 5 && attempts < 1000) {
    const idx = Math.floor(Math.random() * weightedPool.length);
    picked.add(weightedPool[idx]);
    attempts++;
  }

  // If still not 5, fill with random
  while (picked.size < 5) {
    picked.add(Math.floor(Math.random() * 45) + 1);
  }

  return Array.from(picked).sort((a, b) => a - b);
};

/**
 * Check how many numbers a user's scores match with drawn numbers
 * User's 5 scores are matched against the 5 drawn numbers
 */
const checkUserMatch = (userScores, drawnNumbers) => {
  const userValues = userScores.map((s) => s.value);
  const drawnSet = new Set(drawnNumbers);
  const matched = userValues.filter((v) => drawnSet.has(v));
  return matched;
};

/**
 * Determine match type from matched count
 */
const getMatchType = (matchedCount) => {
  if (matchedCount >= 5) return '5-match';
  if (matchedCount === 4) return '4-match';
  if (matchedCount === 3) return '3-match';
  return null;
};

module.exports = { randomDraw, algorithmicDraw, checkUserMatch, getMatchType };