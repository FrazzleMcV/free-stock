const envVariables = {
  PORT: process.env.PORT,
  LOW_BAND_PERCENT: Number(process.env.LOW_BAND_PERCENT),
  MID_BAND_PERCENT: Number(process.env.MID_BAND_PERCENT),
  LOW_BAND_MIN: Number(process.env.LOW_BAND_MIN),
  LOW_BAND_MAX: Number(process.env.LOW_BAND_MAX),
  MID_BAND_MAX: Number(process.env.MID_BAND_MAX),
  HIGH_BAND_MAX: Number(process.env.HIGH_BAND_MAX),
  USE_CPA: process.env.USE_CPA,
  TARGET_CPA : Number(process.env.TARGET_CPA),
}

const validateEnv = (key, variable) => {
  if (variable === undefined || variable === '') {
    throw new Error(`Missing environment variable "${key}"`);
  }
  return variable;
};

const Environment = {
  get: (key) => {
    const value = envVariables[key];
    return validateEnv(key, value);
  },
};

module.exports = Environment;