class MarketClosedError extends Error {
  constructor(error) {
    super(error);
    this.name = 'MarketClosedError';
  }
}

module.exports = MarketClosedError;