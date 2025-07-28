const users = require('../models/User');

exports.register = (req, res) => {
  const { username, password } = req.body;

  if (users[username]) {
    return res.status(400).json({ message: 'User already exists' });
  }

  users[username] = { password, balance: 100000, stocks: {} }; // 初始余额和空股票账户
  res.status(201).json({ message: 'User registered successfully' });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!users[username] || users[username].password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({ message: 'Login successful' });
};
