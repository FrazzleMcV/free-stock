const {lotteryBuyStocks} = require("./lotteryBuyStocks");

const buyAndTransferStocks = async () => {
  return lotteryBuyStocks()
}

module.exports = {
  buyAndTransferStocks
}