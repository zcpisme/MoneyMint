const users = require('../models/User');

exports.buyStock = (req, res) => {
  const { username, symbol, quantity, price } = req.body;
  const user = users[username];

  if (!user) return res.status(404).json({ message: 'User not found' });

  const totalCost = price * quantity;

  if (user.balance < totalCost) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }

  user.balance -= totalCost;
  user.stocks[symbol] = (user.stocks[symbol] || 0) + quantity;

  res.status(200).json({ message: 'Stock purchased', balance: user.balance, stocks: user.stocks });
};

exports.sellStock = (req, res) => {
  const { username, symbol, quantity, price } = req.body;
  const user = users[username];

  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.stocks[symbol] || user.stocks[symbol] < quantity) {
    return res.status(400).json({ message: 'Insufficient stock holdings' });
  }

  user.stocks[symbol] -= quantity;
  user.balance += price * quantity;

  res.status(200).json({ message: 'Stock sold', balance: user.balance, stocks: user.stocks });
};
