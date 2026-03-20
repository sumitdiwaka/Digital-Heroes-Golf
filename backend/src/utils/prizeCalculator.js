/**
 * PRD Section 07 — Prize Pool Logic
 * 5-match: 40% (Jackpot — rolls over if unclaimed)
 * 4-match: 35%
 * 3-match: 25%
 */

const PRIZE_SPLIT = {
  '5-match': 0.40,
  '4-match': 0.35,
  '3-match': 0.25,
};

/**
 * Calculate prize pool tiers from total pool amount
 * @param {number} totalPool - Total prize pool in currency units
 * @param {number} jackpotRollover - Rollover from previous month (5-match only)
 */
const calculatePools = (totalPool, jackpotRollover = 0) => {
  const pool5 = totalPool * PRIZE_SPLIT['5-match'] + jackpotRollover;
  const pool4 = totalPool * PRIZE_SPLIT['4-match'];
  const pool3 = totalPool * PRIZE_SPLIT['3-match'];

  return {
    pool5Match: parseFloat(pool5.toFixed(2)),
    pool4Match: parseFloat(pool4.toFixed(2)),
    pool3Match: parseFloat(pool3.toFixed(2)),
  };
};

/**
 * Split prize equally among multiple winners of same tier
 * @param {number} poolAmount - Total pool for that tier
 * @param {number} winnerCount - How many winners in that tier
 */
const splitPrize = (poolAmount, winnerCount) => {
  if (winnerCount === 0) return 0;
  return parseFloat((poolAmount / winnerCount).toFixed(2));
};

/**
 * Calculate charity contribution from subscription amount
 * @param {number} subscriptionAmount
 * @param {number} charityPercentage - User's chosen percentage (min 10)
 */
const calculateCharityContribution = (subscriptionAmount, charityPercentage = 10) => {
  const percentage = Math.max(10, charityPercentage); // enforce minimum 10%
  return parseFloat(((subscriptionAmount * percentage) / 100).toFixed(2));
};

/**
 * Calculate prize pool contribution from subscription
 * The remaining % after charity goes to prize pool
 */
const calculatePrizePoolContribution = (subscriptionAmount, charityPercentage = 10) => {
  const charityAmount = calculateCharityContribution(subscriptionAmount, charityPercentage);
  return parseFloat((subscriptionAmount - charityAmount).toFixed(2));
};

module.exports = {
  calculatePools,
  splitPrize,
  calculateCharityContribution,
  calculatePrizePoolContribution,
//   PRIZE_SPLIT,
};