class MisconfiguredError extends Error {
  constructor(error) {
    super(error);
    this.name = 'MisconfiguredError';
  }
}

module.exports = MisconfiguredError;