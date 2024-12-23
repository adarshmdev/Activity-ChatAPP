const db = require('../config/db');

const createUser = async (userData) => {
  const { name, email, password } = userData;
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  return db.execute(query, [name, email, password]);
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  return db.execute(query, [email]);
};

module.exports = { createUser, findUserByEmail };