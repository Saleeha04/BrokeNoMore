const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/auth');
const {
  register,
  login,
  getProfile,
  updateUserIncomeGoal,
  logout, // NEW
  getCurrentUser, // NEW 
  getCurrentIncomeGoal, // NEW
  uploadProfilePicture, // NEW
  getUserProfilePicture, // NEW
  testDatabaseSchema, // NEW
  verifySession, // NEW
  authenticateWithSecurityQuestion // NEW
} = require('../Controllers/userController');

// NEW
router.get('/logout', auth, logout);
router.get('/me', auth, getCurrentUser);
router.get('/income-goal', auth, getCurrentIncomeGoal);
router.post('/profile-picture', auth, uploadProfilePicture);
router.get('/profile-picture', auth, getUserProfilePicture);
router.get('/test-schema', testDatabaseSchema); // No auth needed for testing
router.get('/verify-session', verifySession);

// Security question authentication (no auth required)
router.post('/security-auth', authenticateWithSecurityQuestion);

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', auth, getProfile);
router.post('/userdata', auth, updateUserIncomeGoal); // ✅ fixed function name

module.exports = router;
