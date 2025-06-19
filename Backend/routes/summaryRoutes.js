const express = require('express');
const router = express.Router();
const summaryModel = require('../Models/financialSummaryModel');

router.get('/summary/:userId/:month', async (req, res) => {
    const { userId, month } = req.params;
    try {
        const result = await summaryModel.getMonthlySummary(userId, month);
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving summary', error: err.message});
    }
});

module.exports = router;