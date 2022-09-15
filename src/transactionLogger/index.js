//Placeholder interface for some sort of tracking/auditing system

const stocksPurchased = (tickerSymbol, numberOfStocks, sharePrice) => {
  console.log(`${numberOfStocks} ${tickerSymbol} stock(s) purchased at $${sharePrice} each`)
}

const failedStockPurchased = (tickerSymbol, numberOfStocks) => {
  console.log(`Stock Purchase failed : ${tickerSymbol} ${numberOfStocks}`)
}

const failedTransfer = (account, tickerSymbol) => {
  console.log(`Failed to transfer stocks to account ${account} ${tickerSymbol} `)
}

const stockTransfered = (account, tickerSymbol, numberOfStocks) => {
  // console.log(`${numberOfStocks} ${tickerSymbol} stocks transferred to account ${account} `)
}

module.exports = {
  stocksPurchased,
  failedStockPurchased,
  failedTransfer,
  stockTransfered,
}