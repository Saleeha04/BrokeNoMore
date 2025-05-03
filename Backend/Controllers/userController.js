const { getUserByEmail } = require('../models/userModel');

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.status(200).json({ message: "Login successful", user });
};

module.exports = { loginUser };
