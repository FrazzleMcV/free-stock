const Environment = require("../environment");
const MisconfiguredError = require("../errors/MisconfiguredError");
const RollBand = require("./rollBandEnum");

module.exports = (randomNumberGenerator) => {
  const lowBandPercentCap = Environment.get('LOW_BAND_PERCENT')
  const midBandPercentCap = lowBandPercentCap + Environment.get('MID_BAND_PERCENT')

  //Math.random 0 based so we are roll under to beat the band limit
  const isLowBand = result => result < lowBandPercentCap
  const isMidBand = result => result >= lowBandPercentCap && result < midBandPercentCap
  const isHighBand = result => result >= midBandPercentCap && result < 100

  if (midBandPercentCap > 100) {
    throw new MisconfiguredError('Bands misconfigured')
  }

  const getLotteryRewardBand = () => {
    const roll = randomNumberGenerator.rollPercent()
    const rewardBand =
      isLowBand(roll) ? RollBand.LOW :
        isMidBand(roll) ? RollBand.MID :
          isHighBand(roll) ? RollBand.HIGH : null

    //Slightly paranoid levels of defensive here
    if (rewardBand === null) {
      throw new Error('Assigner rolled above 100, failing out in case of tampering or misconfiguration')
    }
    return rewardBand
  }

  return {getLotteryRewardBand}
};