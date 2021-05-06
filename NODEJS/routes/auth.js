const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
// (GET) Login
router.get('/login', authController.getLogin);

// (POST) Login
router.post('/login', authController.postLogin);

// (POST) Logout
router.post('/logout', authController.postLogout);

// (GET) Signup
router.get('/signup', authController.getSignup);

// (POST) Signup
router.post('/signup', authController.postSignup);

module.exports = router;