const AppDataSource = require('../data-source');
const PortfolioRepo = AppDataSource.getRepository('Portfolio');
const HoldingRepo = AppDataSource.getRepository('Holding');
const UserRepo = AppDataSource.getRepository('User');

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

exports.getPortfoliosByUser = async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  try {
    const portfolios = await PortfolioRepo.find({ where: { user: { user_id } } });
    res.status(200).json(portfolios);
  } catch (err) {
    console.error('Fetch portfolios error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getHoldingsByPortfolio = async (req, res) => {
  const portfolio_id = parseInt(req.params.portfolio_id);
  try {
    const holdings = await HoldingRepo.find({ where: { portfolio: { portfolio_id } } });
    res.status(200).json(holdings);
  } catch (err) {
    console.error('Fetch holdings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

