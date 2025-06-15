const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('../Config/db');
const { createUser, getUserByEmail, getUserById } = require('../Models/userModel')

const register = async (req, res) => {
  const { username, email, password, securityQuestion, securityAnswer } = req.body;

  try {
    console.log("✅ Signup request received");
    console.log("Received data:", { username, email, securityQuestion, securityAnswer });

    const existing = await getUserByEmail(email);
    if (existing) {
      console.log("⚠️ Email already exists in database");
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed");

    await createUser(username, email, hashed, securityQuestion, securityAnswer);
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
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.PasswordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, 'secret_key'); // Replace with real secret
    res.json({ message: 'Login successful', token, userId: user.UserID });
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


const checkEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await getUserByEmail(email);
    if (user) {
      return res.status(409).json({ exists: true });
    }
    res.status(200).json({ exists: false });
  } catch (err) {
    res.status(500).json({ message: 'Error checking email', error: err.message });
  }
};



module.exports = { register, login, getProfile, checkEmail  };