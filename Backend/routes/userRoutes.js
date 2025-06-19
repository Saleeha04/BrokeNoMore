const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../Controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', getProfile);



module.exports = router;