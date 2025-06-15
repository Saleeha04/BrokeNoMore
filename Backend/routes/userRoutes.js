const express = require('express');
const router = express.Router();
const { register, login, getProfile ,checkEmail} = require('../Controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', getProfile);
router.get('/check-email', checkEmail);


module.exports = router;