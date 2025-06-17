const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateUserIncomeGoal // ✅ Correct controller here
} = require('../Controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', getProfile);
router.post('/userdata', updateUserIncomeGoal); // ✅ fixed function name

module.exports = router;
