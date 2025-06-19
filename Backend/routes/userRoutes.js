const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/auth');
const {
  register,
  login,
  getProfile,
  updateUserIncomeGoal,
  logout, // NEW
  getCurrentUser // NEW 
} = require('../Controllers/userController');

// NEW
router.get('/logout', auth, logout);
router.get('/me', auth, getCurrentUser);

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', auth, getProfile);
router.post('/userdata', auth, updateUserIncomeGoal); // ✅ fixed function name

module.exports = router;
