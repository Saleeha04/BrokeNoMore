const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateUserIncomeGoal,
  logout, // NEW
  getCurrentUser // NEW 
} = require('../Controllers/userController');

// NEW
router.get('/logout', logout);
router.get('/me', getCurrentUser)

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', getProfile);
router.post('/userdata', updateUserIncomeGoal); // ✅ fixed function name

module.exports = router;
