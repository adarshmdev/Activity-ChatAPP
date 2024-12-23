
const express = require('express');
const { register, login, logout, checkAuthStatus } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', authMiddleware, logout);
router.get('/auth-status', authMiddleware, checkAuthStatus);

module.exports = router;