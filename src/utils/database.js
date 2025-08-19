const { JSONFilePreset } = require('lowdb/node');
const path = require('path');

// Default data structure
const defaultData = {
  users: [],
  tasks: []
};

let db;

/**
 * Initialize the database
 * @returns {Promise<object>} The database instance
 */
const initializeDatabase = async () => {
  if (db) {
    return db;
  }

  const dbPath = process.env.DB_PATH || './data/db.json';
  const fullPath = path.resolve(dbPath);
  
  try {
    // Create the database with file adapter
    db = await JSONFilePreset(fullPath, defaultData);
    
    console.log(`Database initialized at: ${fullPath}`);
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

/**
 * Get the database instance
 * @returns {object} The database instance
 */
const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

module.exports = {
  initializeDatabase,
  getDatabase
};
