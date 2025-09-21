const User = require('../models/User');

// This middleware checks if the user (already authenticated) has the required role.
const checkRole = (requiredRole) => async (req, res, next) => {
  try {
    // req.user.id was set by the first security guard (authMiddleware)
    const user = await User.findById(req.user.id);

    if (user && user.role === requiredRole) {
      // The user's role matches, they can proceed.
      next();
    } else {
      // The user's role does not match. Deny access.
      res.status(403).json({ msg: 'Forbidden: You do not have permission for this action.' });
    }
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

module.exports = checkRole;