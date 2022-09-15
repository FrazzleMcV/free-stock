//Intended as the only place to interface directly with the broker
//Should allow us to easily react to any changes to Broker API

const Broker = require('../broker')
const TransactionLogger = require('../transactionLogger')
const MarketClosedError = require("../errors/MarketClosedError");
const TransferFailedError = require("../errors/TransferFailedError");

const batchBuyStocksForValue = async (minStockValue, maxStockValue, numberOfStocks) => {
  if (numberOfStocks <= 0) return null
  const {open} = await Broker.isMarketOpen()
  if (!open) {
    throw new MarketClosedError('Expected market open for batch buy')
  }

  const selectedStock = await getStockForPriceRange(minStockValue, maxStockValue)
  try {
    const {success, sharePricePaid} = await Broker.buySharesInRewardsAccount(selectedStock.tickerSymbol, numberOfStocks)

    success ? TransactionLogger.stocksPurchased(selectedStock.tickerSymbol, numberOfStocks, sharePricePaid)
      : TransactionLogger.failedStockPurchased(selectedStock.tickerSymbol, numberOfStocks)

    return selectedStock
  } catch (error) {
    //Assumption here that this is the only possible error. For further development would be more robust
    // error defining
    throw new MarketClosedError('Attempted to purchase during closed market')
  }
}

const getStockForPriceRange = async (minStockValue, maxStockValue) => {
  // Potential improvement: if we always get these in the same order do we want to shuffle the
  // array to vary stock selected?
  const tradeableAssetsResponse = await Broker.listTradableAssets()
  // Not a big fan of mutation here, cant but its the simplest way to short circuit instead of iterating over
  // a potentially large number of stocks
  let selectedStock = null
  for (const stock of tradeableAssetsResponse) {
    const {sharePrice} = await Broker.getLatestPrice(stock.tickerSymbol)
    if (sharePrice > minStockValue && sharePrice <= maxStockValue) {
      selectedStock = stock
      break;
    }
  }
  return selectedStock
}

const transferStockToAccount = async (account, stock) => {
  const rewardsAccountPositions = await Broker.getRewardsAccountPositions()
  if (!hasStockAvailableToTransfer(rewardsAccountPositions, stock)) {
    throw createTransferFailedError(account, stock.tickerSymbol)
  }

  const {success} = await Broker.moveSharesFromRewardsAccount(account, stock.tickerSymbol, 1)
  if (!success) {
    throw createTransferFailedError(account, stock.tickerSymbol)
  }
  TransactionLogger.stockTransfered(account, stock.tickerSymbol, 1)
  return success
}

const createTransferFailedError = (account, tickerSymbol) => {
  const errorMessage = `Unable to transfer ${tickerSymbol} to ${account}`
  TransactionLogger.failedTransfer(account, tickerSymbol)
  return new TransferFailedError(errorMessage)
}

const hasStockAvailableToTransfer = (positions, stock) => positions.some(position => position.tickerSymbol === stock.tickerSymbol && position.quantity > 0)

const getNextMarketOpen = async () => {
  const { nextOpeningTime } = await Broker.isMarketOpen()
  return nextOpeningTime
}

module.exports = {
  batchBuyStocksForValue,
  getStockForPriceRange,
  transferStockToAccount,
  getNextMarketOpen,
}