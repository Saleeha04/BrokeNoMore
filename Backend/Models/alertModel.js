const { poolPromise, sql } = require('../Config/db');

const createAlert = async (userId, message) => {
    const pool = await poolPromise;
    return pool.request()
    .input('userId', sql.Int, userId)
    .input('message', sql.NVarChar, message)
    .query('INSERT INTO Alerts (UserID, Message) VALUES (@userId, @message)');

};

const getAlerts = async (userId) => {
    const pool = await poolPromise;
    return pool.request()
    .input('userId', sql.Int, userId)
    .query('SELECT * FROM Alerts WHERE UserID = @userId ORDER BY CreatedAt DESC');
};

const markAsRead = async (alertId) => {
    const pool = await poolPromise;
    return pool.request()
    .input('alertId', sql.Int, alertId)
    .query('UPDATE Alerts SET IsRead = 1 WHERE AlertID = @alertId');
};

module.exports = {
    createAlert,
    getAlerts,
    markAsRead
};