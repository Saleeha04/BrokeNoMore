const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('../Config/db');
const { createUser, getUserByUsername, getUserById } = require('../Models/userModel'); // Updated import

const register = async (req, res) => {
  const { username, password, securityQuestion, securityAnswer } = req.body;

  try {
    console.log("✅ Signup request received");
    console.log("Received data:", { username, securityQuestion, securityAnswer });

    const existing = await getUserByUsername(username); // Should work now
    if (existing) {
      console.log("⚠️ Username already exists in database");
      return res.status(400).json({ message: 'Username already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed");

    await createUser(username, hashed, securityQuestion, securityAnswer);
    console.log("✅ User created in DB");

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("❌ Error during signup:");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);

    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.PasswordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, 'secret_key');
    res.json({ message: 'Login successful', token, userId: user.id });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

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

module.exports = { register, login, getProfile };