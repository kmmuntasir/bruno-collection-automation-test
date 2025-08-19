const express = require('express');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(422).json({
        error: 'Email and password are required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({
        error: 'Please provide a valid email address'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(422).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    // Create user
    const user = await User.create(email.toLowerCase().trim(), password);

    res.status(201).json(user);
  } catch (error) {
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * POST /auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(422).json({
        error: 'Email and password are required'
      });
    }

    // Authenticate user
    const user = await User.authenticate(email.toLowerCase().trim(), password);
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email
    });

    res.status(200).json({
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;
