const budgetModel = require('../Models/budgetModel');

const createGoal = async (req, res) => {
    const {userId, month, amount} = req.body;
    try {
        await budgetModel.createBudgetGoal(userId, month, amount);
        res.status(201).json({ message: 'Budget goal created successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating goal.', error: err.message});
    }
};

const updateGoal = async (req, res) => {
    const { userId, month, newAmount } = req.body;
    try {
        await budgetModel.updateBudgetGoal(userId, month, newAmount);
        res.status(200).json({ message: 'Budget goal updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating goal.', error: err.message });
    }
};

const getGoal = async (req, res) => {
    const { userId, month } = req.params;
    try {
        const result = await budgetModel.getBudgetGoal(userId, month);
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieiving goal information.', error: err.message });
    }
};

module.exports = {
    createGoal,
    updateGoal,
    getGoal
};