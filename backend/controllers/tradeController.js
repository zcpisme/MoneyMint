const AppDataSource = require('../data-source');
const PortfolioRepo = AppDataSource.getRepository('Portfolio');
const HoldingRepo = AppDataSource.getRepository('Holding');
const TransactionRepo = AppDataSource.getRepository('Transaction');

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
  const { portfolio_id, symbol, quantity, price } = req.body;

  try {
    const portfolio = await PortfolioRepo.findOneBy({ portfolio_id });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const user = portfolio.user;

    const holding = await HoldingRepo.findOneBy({ symbol, user: user.user_id, portfolio: { portfolio_id } });

    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient holdings' });
    }

    holding.quantity -= quantity;
    if (holding.quantity === 0) {
      await HoldingRepo.remove(holding);
    } else {
      await HoldingRepo.save(holding);
    }

    // 添加交易记录
    const txn = TransactionRepo.create({
      symbol,
      txn_type: 'SELL',
      quantity,
      price_per_unit: price,
      txn_date: new Date(),
      user,
      portfolio,
    });
    await TransactionRepo.save(txn);

    // 加回余额
    user.balance += quantity * price;
    await AppDataSource.getRepository('User').save(user);

    res.status(200).json({ message: 'Stock sold successfully' });
  } catch (err) {
    console.error('Sell error:', err);
    res.status(500).json({ message: 'Server error during sell' });
  }
};

