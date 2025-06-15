const express = require('express');
const router = express.Router();
const goalController = require('../Controllers/goalController');

router.post('/budget', goalController.createGoal);
router.put('/budget/:month', goalController.updateGoal);
router.get('/budget/:userId/:month', goalController.getGoal);

module.exports = router;