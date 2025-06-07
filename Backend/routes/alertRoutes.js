const express = require('express');
const router = express.Router();
const alertModel = require('../Models/alertModel');

router.post('/alerts', async(req, res) => {
    const { userId, message } = req.body;
    try {
        await alertModel.createAlert(userId, message);
        res.status(201).json({ message: 'Alert created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating alert', error: err.message });
    }
});

router.get('/alerts/:userId', async(req, res) => {
    try {
        const result = await alertModel.getAlerts(req.params.userId);
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching alerts', error: err.message});
    }
});

module.exports = router;