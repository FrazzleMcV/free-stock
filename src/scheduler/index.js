const BrokerManager = require('../brokerManager')
const StockTransferManager = require('../stockTransferTaskManager')
const Logger = require("../logger");
const schedule = require('node-schedule')

const scheduleTransferForNextOpenTime = async () => {
  //assumes JS parsable date is returned
  //assumes that this will always be the next opening time
  const nextOpenTime = await BrokerManager.getNextMarketOpen()
  Logger.trace(`Setting next run at ${new Date(nextOpenTime)}`)
  const job = schedule.scheduleJob(
    new Date(nextOpenTime),
    async () => {
      Logger.trace('Starting Buy and Transfer Job')
      const runErrors = await StockTransferManager.buyAndTransferStocks()
      Logger.error(runErrors)
      return scheduleTransferForNextOpenTime()
    },
  )
  return job
}


module.exports = {
  scheduleTransferForNextOpenTime,
}