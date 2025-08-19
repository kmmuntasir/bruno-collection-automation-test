const { verifyToken, extractToken } = require('../utils/jwt');

/**
 * Authentication middleware to protect routes
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({
        error: 'Access token is required'
      });
    }

    const decoded = verifyToken(token);
    
    // Add user information to request object
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token has expired'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token'
      });
    } else {
      return res.status(401).json({
        error: 'Authentication failed'
      });
    }
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email
      };
    }

    next();
  } catch (error) {
    // Ignore authentication errors in optional auth
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};
