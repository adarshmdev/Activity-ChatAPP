const db = require('../config/db');

const createUser = (userData, callback) => {
  const { name, email, password } = userData;
  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    callback
  );
};

const findUserByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

module.exports = { createUser, findUserByEmail };
