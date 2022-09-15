const {MathRandom} = require('../util')
const Environment = require('../environment')
const {getLotteryRewardBand} = require('../assigner')(MathRandom)
const RollBand = require('../assigner/rollBandEnum')
const BrokerManager = require('../brokerManager')
const ClaimRegistry = require('../claimRegistry')
const LOW_BAND_MINIMUM_PRICE = Environment.get('LOW_BAND_MIN')
const LOW_BAND_MAXIMUM_PRICE = Environment.get('LOW_BAND_MAX')
const MID_BAND_MAXIMUM_PRICE = Environment.get('MID_BAND_MAX')
const HIGH_BAND_MAX_PRICE = Environment.get('HIGH_BAND_MAX')

const runLotteryOnAccounts = () => {
  const accounts = ClaimRegistry.drainAllClaims()

  return accounts.reduce((bandAssignments, account) => {
      const lotteryBand = getLotteryRewardBand()
      bandAssignments[lotteryBand].push(account)
      return bandAssignments
    },
    {
      [RollBand.LOW]: [],
      [RollBand.MID]: [],
      [RollBand.HIGH]: []
    })
}

const lotteryBuyStocks = async (accounts) => {
  const accountsByLotteryBand = runLotteryOnAccounts(accounts)

  const lowWinners = accountsByLotteryBand[RollBand.LOW]
  const midWinners = accountsByLotteryBand[RollBand.MID]
  const highWinners = accountsByLotteryBand[RollBand.HIGH]

  const lowBandStock = await purchaseLowBandStock(lowWinners)
  const midBandStock = await purchaseMidBandStock(midWinners)
  const highBandStock = await purchaseHighBandStock(highWinners)

  const lowBandTransferFunction = lowWinners.map(winner => async () => BrokerManager.transferStockToAccount(winner, lowBandStock))
  const midBandTransferFunction = midWinners.map(winner => async () => BrokerManager.transferStockToAccount(winner, midBandStock))
  const highBandTransferFunction = highWinners.map(winner => async () => BrokerManager.transferStockToAccount(winner, highBandStock))

  const transferFunctionBatch = [...lowBandTransferFunction, ...midBandTransferFunction, ...highBandTransferFunction]
  const errorList = []
  // Do this in sequence to not overwhelm the broker
  for(const transferFunction of transferFunctionBatch) {
    try {
      await transferFunction()
    } catch (error) {
      errorList.push(error)
    }
  }

  return errorList
}

const purchaseLowBandStock = (winners) => BrokerManager.batchBuyStocksForValue(LOW_BAND_MINIMUM_PRICE, LOW_BAND_MAXIMUM_PRICE, winners.length)
const purchaseMidBandStock = (winners) => BrokerManager.batchBuyStocksForValue(LOW_BAND_MAXIMUM_PRICE, MID_BAND_MAXIMUM_PRICE, winners.length)
const purchaseHighBandStock = (winners) => BrokerManager.batchBuyStocksForValue(MID_BAND_MAXIMUM_PRICE, HIGH_BAND_MAX_PRICE, winners.length)

module.exports = {
  lotteryBuyStocks
}