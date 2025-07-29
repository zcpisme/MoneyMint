const AppDataSource = require('../data-source');
const PortfolioRepo = AppDataSource.getRepository('Portfolio');
const HoldingRepo = AppDataSource.getRepository('Holding');
const UserRepo = AppDataSource.getRepository('User');
const axios = require('axios');
exports.createPortfolio = async (req, res) => {
  const { user_id, name } = req.body;
  try {
    const user = await UserRepo.findOneBy({ user_id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newPortfolio = PortfolioRepo.create({
      name,
      user,
      created_at: new Date(),
    });

    const saved = await PortfolioRepo.save(newPortfolio);

    res.status(201).json({
      message: 'Portfolio created',
      portfolio: {
        id: saved.portfolio_id,
        name: saved.name,
      },
    });
  } catch (err) {
    console.error('Create portfolio error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
async function fetchCurrentPrice(symbol) {
  try {
    const res = await axios.get(`https://moneymint.onrender.com/current-price`, {
      params: { ticker: symbol }
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error.message);
    return {
      ticker: symbol,
      current_price: null,
      daily_change: null,
    };
  }
}
exports.getPortfoliosByUser = async (req, res) => {
  const user_id = parseInt(req.params.user_id);

  try {
    const portfolios = await PortfolioRepo.find({
      where: { user: { user_id } },
      relations: ['holdings'],
    });

    const result = await Promise.all(portfolios.map(async (portfolio) => {
      const holdingsWithPrices = await Promise.all(
        portfolio.holdings.map(async (holding) => {
          const priceInfo = await fetchCurrentPrice(holding.symbol);

          return {
            symbol: holding.symbol,
            quantity: holding.quantity,
            avg_buy_price: holding.avg_buy_price,
            current_price: priceInfo.current_price,
            daily_change: priceInfo.daily_change
          };
        })
      );

      return {
        portfolio_id: portfolio.portfolio_id,
        name: portfolio.name,
        holdings: holdingsWithPrices
      };
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error('Fetch portfolios error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// exports.getHoldingsByPortfolio = async (req, res) => {
//   const portfolio_id = parseInt(req.params.portfolio_id);
//   try {
//     const holdings = await HoldingRepo.find({ where: { portfolio: { portfolio_id } } });
//     res.status(200).json(holdings);
//   } catch (err) {
//     console.error('Fetch holdings error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

