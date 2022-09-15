const Broker = {
  listTradableAssets: jest.fn(),
  getLatestPrice: jest.fn(),
  buySharesInRewardsAccount: jest.fn(),
  getRewardsAccountPositions: jest.fn(),
  moveSharesFromRewardsAccount: jest.fn(),
  isMarketOpen: jest.fn()
};

module.exports = Broker;
