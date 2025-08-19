const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../utils/database');
const { hashPassword, comparePassword } = require('../utils/password');

/**
 * User model with database operations
 */
class User {
  /**
   * Create a new user
   * @param {string} email - User email
   * @param {string} password - User password (plain text)
   * @returns {Promise<object>} The created user (without password)
   * @throws {Error} If email already exists
   */
  static async create(email, password) {
    const db = getDatabase();
    
    // Check if user already exists
    const existingUser = db.data.users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create user object
    const user = {
      id: uuidv4(),
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    // Add to database
    db.data.users.push(user);
    await db.write();

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {object|null} The user object or null if not found
   */
  static findByEmail(email) {
    const db = getDatabase();
    return db.data.users.find(user => user.email === email) || null;
  }

  /**
   * Find a user by ID
   * @param {string} id - User ID
   * @returns {object|null} The user object or null if not found
   */
  static findById(id) {
    const db = getDatabase();
    return db.data.users.find(user => user.id === id) || null;
  }

  /**
   * Authenticate a user
   * @param {string} email - User email
   * @param {string} password - User password (plain text)
   * @returns {Promise<object|null>} The user object (without password) if authenticated, null otherwise
   */
  static async authenticate(email, password) {
    const user = User.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get all users (without password hashes) - for development/testing
   * @returns {Array} Array of user objects without passwords
   */
  static getAll() {
    const db = getDatabase();
    return db.data.users.map(user => {
      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

module.exports = User;
