const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { register, login, getProfile } = require('../Controllers/userController');
=======
const { register, login, getProfile ,checkEmail} = require('../Controllers/userController');
>>>>>>> da21a3c9f73b332f5bfda51fd8138d693adba77a

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', getProfile);
<<<<<<< HEAD

=======
router.get('/check-email', checkEmail);


>>>>>>> da21a3c9f73b332f5bfda51fd8138d693adba77a
module.exports = router;