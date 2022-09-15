const datePlus2Min = () => {
  const date = new Date()
  const mins = date.getMinutes()
  return date.setMinutes(mins + 1)
}
const getLatestPrice = async (symbol) => {
  const prices = {
    low: 5,
    mid: 15,
    high: 150
  }
  return {sharePrice : prices[symbol]}
}

const getRewardsAccountPositions = async () => [
  {tickerSymbol: 'low', quantity: 1, sharePrice: 5},
  {tickerSymbol: 'mid', quantity: 1, sharePrice: 15},
  {tickerSymbol: 'high', quantity: 1, sharePrice: 150}
]

const buySharesInRewardsAccount = async (symbol, numberOFStocks) => {
  const prices = {
    'low' : 5,
    'mid': 15,
    'high' : 150
  }
  return {success: true, sharePricePaid: prices[symbol]}
}

module.exports = {
  listTradableAssets: async () => [{tickerSymbol: 'low'}, {tickerSymbol: 'mid'}, {tickerSymbol: 'high'}],
  getLatestPrice,
  isMarketOpen: async () => ({
    open: true,
    nextOpeningTime: datePlus2Min()
  }),
  buySharesInRewardsAccount,
  getRewardsAccountPositions,
  moveSharesFromRewardsAccount: async () => ({success: true}),
}