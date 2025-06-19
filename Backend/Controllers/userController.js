const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername, getUserById, saveIncomeAndGoal, updateProfilePicture, getProfilePicture } = require('../Models/userModel');
const { poolPromise, sql } = require('../Config/db');

// is file mn changings kr rahi, so don't freak out if it isn't working anymore

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.PasswordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = {
      id: user.id, // ✅ not user.UserID
      username: user.username // ✅ not user.Username
    };


    res.status(200).json({ message: 'Login successful', user: req.session.user });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};


const logout = async (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
};

const getCurrentUser = async (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
};


// End of my shaninagins




const register = async (req, res) => {
  const { username, password, securityQuestion, securityAnswer } = req.body;

  try {
    console.log("✅ Signup request received");
    console.log("Received data:", { username, securityQuestion, securityAnswer });

    const existing = await getUserByUsername(username);
    if (existing) {
      console.log("⚠️ Username already exists");
      return res.status(400).json({ message: 'Username already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await createUser(username, hashed, securityQuestion, securityAnswer);
    console.log("✅ User created");

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("❌ Error during signup:", err);
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};


// ========= this is your original login:
// const login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await getUserByUsername(username);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const match = await bcrypt.compare(password, user.PasswordHash);
//     if (!match) return res.status(401).json({ message: 'Invalid credentials' });

//     const token = jwt.sign({ id: user.id }, 'secret_key');
//     res.json({ message: 'Login successful', token, userId: user.id });
//   } catch (err) {
//     console.error("❌ Login error:", err.message);
//     res.status(500).json({ message: 'Login error', error: err.message });
//   }
// };

const getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

const updateUserIncomeGoal = async (req, res) => {
  const { income, goal } = req.body;
  const userId = req.session.user.id; // Get user ID from session

  if (!income || !goal) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if user has exceeded the 3 edits per month limit for goals
    const pool = await poolPromise;
    const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
    
    // Check existing goal edit count (only for goal updates)
    let goalEditCount = 0;
    const goalCheck = await pool.request()
      .input('userId', sql.Int, userId)
      .input('month', sql.Date, currentMonth)
      .query('SELECT EditCount FROM BudgetGoals WHERE UserID = @userId AND Month = @month');
    
    if (goalCheck.recordset.length > 0) {
      goalEditCount = goalCheck.recordset[0].EditCount;
    }
    
    // Check if goal is being updated (compare with existing goal)
    const existingGoalCheck = await pool.request()
      .input('userId', sql.Int, userId)
      .input('month', sql.Date, currentMonth)
      .query('SELECT Amount FROM BudgetGoals WHERE UserID = @userId AND Month = @month');
    
    const existingGoal = existingGoalCheck.recordset.length > 0 ? existingGoalCheck.recordset[0].Amount : null;
    const isGoalBeingUpdated = existingGoal === null || parseFloat(existingGoal) !== parseFloat(goal);
    
    // Check if income is being updated (compare with existing income)
    const existingIncomeCheck = await pool.request()
      .input('userId', sql.Int, userId)
      .input('month', sql.Date, currentMonth)
      .query('SELECT Amount FROM Income WHERE UserID = @userId AND MonthI = @month');
    
    const existingIncome = existingIncomeCheck.recordset.length > 0 ? existingIncomeCheck.recordset[0].Amount : null;
    const isIncomeBeingUpdated = existingIncome === null || parseFloat(existingIncome) !== parseFloat(income);
    
    // Only apply edit limit if goal is being updated
    if (isGoalBeingUpdated && goalEditCount >= 3) {
      return res.status(400).json({ 
        message: 'You have reached the maximum limit of 3 goal updates per month. Please wait until next month to update your goal again.' 
      });
    }
    
    await saveIncomeAndGoal(userId, income, goal);
    res.status(200).json({ 
      message: 'Income and goal saved successfully',
      editCount: isGoalBeingUpdated ? goalEditCount + 1 : goalEditCount,
      goalUpdated: isGoalBeingUpdated,
      incomeUpdated: isIncomeBeingUpdated
    });
  } catch (err) {
    console.error("❌ Error saving income/goal:", err.message);
    res.status(500).json({ message: 'Error saving data', error: err.message });
  }
};

// Get current income and goal for the logged-in user
const getCurrentIncomeGoal = async (req, res) => {
  const userId = req.session.user.id;
  
  try {
    const pool = await poolPromise;
    const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
    
    // Get current month's income
    const incomeResult = await pool.request()
      .input('userId', sql.Int, userId)
      .input('month', sql.Date, currentMonth)
      .query('SELECT Amount FROM Income WHERE UserID = @userId AND MonthI = @month');
    
    // Get current month's goal
    const goalResult = await pool.request()
      .input('userId', sql.Int, userId)
      .input('month', sql.Date, currentMonth)
      .query('SELECT Amount, EditCount FROM BudgetGoals WHERE UserID = @userId AND Month = @month');
    
    const income = incomeResult.recordset.length > 0 ? incomeResult.recordset[0].Amount : 0;
    const goal = goalResult.recordset.length > 0 ? goalResult.recordset[0].Amount : 0;
    const editCount = goalResult.recordset.length > 0 ? goalResult.recordset[0].EditCount : 0;
    
    res.status(200).json({
      income,
      goal,
      editCount,
      remainingEdits: Math.max(0, 3 - editCount)
    });
  } catch (err) {
    console.error("❌ Error fetching income/goal:", err.message);
    res.status(500).json({ message: 'Error fetching data', error: err.message });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  const userId = req.session.user.id;
  const { profilePictureData } = req.body;

  console.log("Uploading profile picture for user:", userId);
  console.log("Profile picture data length:", profilePictureData ? profilePictureData.length : 'undefined');

  if (!profilePictureData) {
    return res.status(400).json({ message: 'No profile picture data provided' });
  }

  try {
    await updateProfilePicture(userId, profilePictureData);
    res.status(200).json({ message: 'Profile picture updated successfully' });
  } catch (err) {
    console.error("❌ Error updating profile picture:", err.message);
    console.error("❌ Full error:", err);
    res.status(500).json({ message: 'Error updating profile picture', error: err.message });
  }
};

// Get profile picture
const getUserProfilePicture = async (req, res) => {
  const userId = req.session.user.id;

  console.log("Getting profile picture for user:", userId);

  try {
    const profilePicture = await getProfilePicture(userId);
    console.log("Profile picture found:", !!profilePicture);
    if (profilePicture) {
      res.status(200).json({ profilePicture });
    } else {
      res.status(404).json({ message: 'No profile picture found' });
    }
  } catch (err) {
    console.error("❌ Error fetching profile picture:", err.message);
    console.error("❌ Full error:", err);
    res.status(500).json({ message: 'Error fetching profile picture', error: err.message });
  }
};

// Test endpoint to check database schema
const testDatabaseSchema = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT COLUMN_NAME, DATA_TYPE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Users' 
        AND COLUMN_NAME = 'ProfilePicture'
      `);
    
    console.log("Database schema check result:", result.recordset);
    res.status(200).json({ 
      message: 'Database schema check completed',
      profilePictureColumnExists: result.recordset.length > 0,
      columns: result.recordset
    });
  } catch (err) {
    console.error("❌ Error checking database schema:", err.message);
    res.status(500).json({ message: 'Error checking database schema', error: err.message });
  }
};

module.exports = {
  getCurrentUser, // NEW
  logout, // NEW

  register,
  login,
  getProfile,
  updateUserIncomeGoal,
  getCurrentIncomeGoal,
  uploadProfilePicture,
  getUserProfilePicture,
  testDatabaseSchema
};