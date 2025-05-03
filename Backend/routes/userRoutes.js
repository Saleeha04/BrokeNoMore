const express = require('express');
const { loginUser } = require('../Controllers/userController');
const router = express.Router();

router.post('/login', loginUser);  // /api/users/login

module.exports = router;
