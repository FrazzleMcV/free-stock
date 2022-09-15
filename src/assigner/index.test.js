jest.mock('../environment')
const Environment = require('../environment')
Environment.mockEnvs({
  LOW_BAND_PERCENT : 60,
  MID_BAND_PERCENT : 30,
})
const RollBand = require('./rollBandEnum')
const Assigner = require('./index')

const createNumberGenerator = (number) => ({
  rollPercent : () => number
})

describe('Assigner', () => {
  describe('function', () => {
    beforeAll(() => {

      Environment.mockEnvs({
        LOW_BAND_PERCENT : 60,
        MID_BAND_PERCENT : 30,
      })
    })

    it('should get low band for low roll', () => {
      const randomNumberGenerator = createNumberGenerator(20)
      const result = Assigner(randomNumberGenerator).getLotteryRewardBand()
      expect(result).toEqual(RollBand.LOW)
    })
    it('should get mid band for mid roll', () => {
      const randomNumberGenerator = createNumberGenerator(60)
      const result = Assigner(randomNumberGenerator).getLotteryRewardBand()
      expect(result).toEqual(RollBand.MID)
    })
    it('should get high band for high roll', () => {
      const randomNumberGenerator = createNumberGenerator(90)
      const result = Assigner(randomNumberGenerator).getLotteryRewardBand()
      expect(result).toEqual(RollBand.HIGH)
    })
    it('should throw an error if higher than 100 rolled', () => {
      expect.assertions(1)
      const randomNumberGenerator = createNumberGenerator(101)
      try {
        const result = Assigner(randomNumberGenerator).getLotteryRewardBand()
      } catch (error) {
        expect(error.message).toEqual('Assigner rolled above 100, failing out in case of tampering or misconfiguration')
      }
    })
  })

  describe('Configuration', () => {
    beforeAll(() => {
      Environment.mockEnvs({
        LOW_BAND_PERCENT : 60,
        MID_BAND_PERCENT : 50,
      })
    })

    it('should error when % configurations are greater than 100%', () => {
      expect.assertions(1)
      const randomNumberGenerator = createNumberGenerator(10)
      try {
        const result = Assigner(randomNumberGenerator).getLotteryRewardBand()
      } catch (error) {
        expect(error.message).toEqual('Bands misconfigured')
      }
    })
  })
})