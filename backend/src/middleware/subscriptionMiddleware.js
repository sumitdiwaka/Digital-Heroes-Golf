const subscribersOnly = (req, res, next) => {
  if (req.user && req.user.subscriptionStatus === 'active') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Active subscription required to access this feature.',
  });
};

module.exports = { subscribersOnly };