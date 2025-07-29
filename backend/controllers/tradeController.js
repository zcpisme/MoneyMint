const AppDataSource = require('../data-source');
const PortfolioRepo = AppDataSource.getRepository('Portfolio');
const HoldingRepo = AppDataSource.getRepository('Holding');
const TransactionRepo = AppDataSource.getRepository('Transaction');
const UserRepo = AppDataSource.getRepository('User');
const axios = require('axios');
async function fetchCurrentPrice(symbol) {
  try {
    const res = await axios.get('https://moneymint.onrender.com/current-price', {
      params: { ticker: symbol }
    });
    return res.data.current_price;
  } catch (err) {
    console.error(`Error fetching price for ${symbol}:`, err.message);
    return 0;
  }
}

exports.buyStock = async (req, res) => {
  const { portfolio_id, symbol, quantity, price } = req.body;

  try {
    const portfolio = await PortfolioRepo.findOneBy({ portfolio_id });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const totalCost = quantity * price;

    // 检查用户余额
    const user = portfolio.user;
    if (user.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // 更新或创建持仓
    let holding = await HoldingRepo.findOneBy({ symbol, user: user.user_id, portfolio: { portfolio_id } });
    if (holding) {
      const totalQty = holding.quantity + quantity;
      holding.avg_buy_price = ((holding.avg_buy_price * holding.quantity) + (price * quantity)) / totalQty;
      holding.quantity = totalQty;
    } else {
      holding = HoldingRepo.create({
        symbol,
        quantity,
        avg_buy_price: price,
        user,
        portfolio,
        updated_at: new Date(),
      });
    }
    await HoldingRepo.save(holding);

    // 插入交易记录
    const txn = TransactionRepo.create({
      symbol,
      txn_type: 'BUY',
      quantity,
      price_per_unit: price,
      txn_date: new Date(),
      user,
      portfolio,
    });
    await TransactionRepo.save(txn);

    // 扣除余额
    user.balance -= totalCost;
    await AppDataSource.getRepository('User').save(user);

    res.status(200).json({ message: 'Stock purchased successfully' });
  } catch (err) {
    console.error('Buy error:', err);
    res.status(500).json({ message: 'Server error during buy' });
  }
};


exports.sellStock = async (req, res) => {
  const { portfolio_id, symbol, quantity } = req.body;

  try {
    const portfolio = await PortfolioRepo.findOneBy({ portfolio_id });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const user = portfolio.user;

    const holding = await HoldingRepo.findOneBy({ symbol, user: user.user_id, portfolio: { portfolio_id } });
    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient holdings' });
    }

    const currentPrice = await fetchCurrentPrice(symbol);
    // ✅ 更新持仓
    holding.quantity -= quantity;
    if (holding.quantity === 0) {
      await HoldingRepo.remove(holding);
    } else {
      await HoldingRepo.save(holding);
    }

    // ✅ 添加交易记录（使用 currentPrice）
    const txn = TransactionRepo.create({
      symbol,
      txn_type: 'SELL',
      quantity,
      price_per_unit: currentPrice,
      txn_date: new Date(),
      user,
      portfolio,
    });
    await TransactionRepo.save(txn);

    // ✅ 更新用户余额
    const current = Number(user.balance);   // 或  parseFloat(user.balance)
    user.balance = current + Number(quantity * currentPrice);
    await AppDataSource.getRepository('User').save(user);

    res.status(200).json({ message: 'Stock sold successfully', sell_price: currentPrice, current_balance: parseFloat(user.balance) });
  } catch (err) {
    console.error('Sell error:', err);
    res.status(500).json({ message: 'Server error during sell' });
  }
};

exports.chargeBalance = async (req, res) => {
  const { user_id, amount } = req.body;

  try {
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const user = await UserRepo.findOne({
      where: { user_id },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const current = Number(user.balance);   // 或  parseFloat(user.balance)
    user.balance = current + Number(amount);
    await UserRepo.save(user);

    res.status(200).json({
      message: 'Balance recharged successfully',
      new_balance: parseFloat(user.balance),
    });
  } catch (err) {
    console.error('Recharge error:', err);
    res.status(500).json({ message: 'Server error during recharge' });
  }
};

