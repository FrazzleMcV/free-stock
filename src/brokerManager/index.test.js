jest.mock('../broker')
jest.mock('../transactionLogger', () => ({
  stocksPurchased: jest.fn(),
  failedStockPurchased: jest.fn(),
  failedTransfer: jest.fn(),
  stockTransfered: jest.fn(),
}))
const BrokerManager = require('./index')
const Broker = require('../broker')
const TransactionLogger = require('../transactionLogger')
const exampleStock = {tickerSymbol: 'some-symbol'}

const testDate = new Date().toTimeString()

describe('Broker Manager', () => {
  // Default broker state
  beforeEach(() => {
    Broker.listTradableAssets.mockResolvedValue([exampleStock])
    Broker.getLatestPrice.mockResolvedValue({sharePrice: 15})
    Broker.buySharesInRewardsAccount.mockResolvedValue({success: true, sharePricePaid: 15})
    Broker.isMarketOpen.mockResolvedValue({open: true, nextOpeningTime: testDate, nextClosingTime: testDate})
    Broker.moveSharesFromRewardsAccount.mockResolvedValue({success: true})
    Broker.getRewardsAccountPositions.mockResolvedValue([{tickerSymbol: 'some-symbol', quantity: 1, sharePrice: 5}])
  })

  describe('Batch Buy Stocks', () => {
    it('should buy stocks for given price range', async () => {
      const numberOfStocksToBuy = 5
      const result = await BrokerManager.batchBuyStocksForValue(10, 20, numberOfStocksToBuy)
      expect(Broker.buySharesInRewardsAccount).toHaveBeenCalledWith(exampleStock.tickerSymbol, 5)
      expect(result).toEqual(exampleStock)
    })

    it('should logic out early if 0 stocks requested', async () => {
      const numberOfStocksToBuy = 0
      const result = await BrokerManager.batchBuyStocksForValue(10, 20, numberOfStocksToBuy)
      expect(Broker.buySharesInRewardsAccount).not.toHaveBeenCalled()
      expect(result).toEqual(null)
    })

    it('should throw an error if market is closed', async () => {
      Broker.isMarketOpen.mockResolvedValue({open: false})
      const numberOfStocksToBuy = 5
      try {
        await BrokerManager.batchBuyStocksForValue(10, 20, numberOfStocksToBuy)
        throw Error('expected test failure')
      } catch (error) {
        expect(error.message).toEqual('Expected market open for batch buy')
      }
    })

    it('should throw an error if buy fails', async () => {
      Broker.buySharesInRewardsAccount.mockRejectedValue(new Error('some-error'))
      const numberOfStocksToBuy = 5
      try {
        await BrokerManager.batchBuyStocksForValue(10, 20, numberOfStocksToBuy)
        throw Error('expected test failure')
      } catch (error) {
        expect(error.message).toEqual('Attempted to purchase during closed market')
      }
    })
  })

  describe('Get Stock For Price Range', () => {
    it('should get a stock in the range given', async () => {
      const result = await BrokerManager.getStockForPriceRange(5, 15)
      expect(result).toEqual(exampleStock)
    })

    it('should return null if no stock found', async () => {
      const result = await BrokerManager.getStockForPriceRange(50, 100)
      expect(result).toEqual(null)
    })
  })

  describe('Transfer Stock To Account', () => {
    it('should transfer stocks', async () => {
      const result = await BrokerManager.transferStockToAccount('some-account', exampleStock)
      expect(result).toEqual(true)
      expect(Broker.moveSharesFromRewardsAccount).toHaveBeenCalledWith('some-account', exampleStock.tickerSymbol, 1)
    })

    it('should throw an error if stock is not available', async () => {
      Broker.getRewardsAccountPositions.mockResolvedValue([])
      try {
        await BrokerManager.transferStockToAccount('some-account', exampleStock)
        throw new Error('expected failure')
      } catch (error) {
        expect(error.message).toEqual('Unable to transfer some-symbol to some-account')
      }
    })

    it('should throw an error if transfer fails', async () => {
      Broker.moveSharesFromRewardsAccount.mockResolvedValue({success: false})
      try {
        await BrokerManager.transferStockToAccount('some-account', exampleStock)
        throw new Error('expected failure')
      } catch (error) {
        expect(error.message).toEqual('Unable to transfer some-symbol to some-account')
      }
    })
  })

  describe('Get Next Market Open', () => {
    beforeAll(() => {
      Broker.isMarketOpen.mockResolvedValue({open: true, nextOpeningTime: testDate, nextCLosingTime: testDate})
    })

    it('should get the next market open time from the broker', async () => {
      const result = await BrokerManager.getNextMarketOpen()
      expect(result).toEqual(testDate)
    })
  })

  describe('Transaction Manager', () => {
    it('should log stock purchase event when buying stocks', async () => {
      const numberOfStocksToBuy = 5
      await BrokerManager.batchBuyStocksForValue(10, 20, numberOfStocksToBuy)
      expect(TransactionLogger.stocksPurchased).toHaveBeenCalledWith('some-symbol', 5, 15)
    });

    it('should log stock purchase failure event when buying stocks fails', async () => {
      Broker.buySharesInRewardsAccount.mockResolvedValue({success: false})
      const numberOfStocksToBuy = 5
      try {
        await BrokerManager.batchBuyStocksForValue(10, 20, numberOfStocksToBuy)
        throw Error('expected test failure')
      } catch (error) {
        expect(TransactionLogger.failedStockPurchased).toHaveBeenCalledWith('some-symbol', 5)
      }
    });

    it('should log stock transfer event when stock transferred', async () => {
      const result = await BrokerManager.transferStockToAccount('some-account', exampleStock)
      expect(result).toEqual(true)
      expect(TransactionLogger.stockTransfered).toHaveBeenCalledWith('some-account', exampleStock.tickerSymbol, 1)
    });

    it('should log stock transfer failure event when stock transferred failed', async () => {
      Broker.getRewardsAccountPositions.mockResolvedValue([])
      try {
        await BrokerManager.transferStockToAccount('some-account', exampleStock)
        throw new Error('expected failure')
      } catch (error) {
        expect(TransactionLogger.failedTransfer).toHaveBeenCalledWith('some-account', 'some-symbol')
      }
    });
  })
});