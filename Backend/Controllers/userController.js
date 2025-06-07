const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail, getUserById } = require('../models/userModel');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await getUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    await createUser(username, email, hashed);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
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
    res.json({ message: 'Login successful', token });
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