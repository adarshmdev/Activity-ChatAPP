const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');

const register = (req, res) => {
  const { name, email, password } = req.body;

  findUserByEmail(email, (err, results) => {
    if (results.length) return res.status(400).json({ message: 'User exists' });

    const hashedPassword = bcrypt.hashSync(password, 8);
    createUser({ name, email, password: hashedPassword }, (err, result) => {
      if (err) return res.status(500).json({ message: 'DB Error' });
      res.status(201).json({ message: 'User registered' });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, (err, results) => {
    if (!results.length) return res.status(400).json({ message: 'User not found' });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  });
};

module.exports = { register, login };
