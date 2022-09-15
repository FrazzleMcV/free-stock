class TransferFailedError extends Error {
  constructor(error) {
    super(error);
    this.name = 'TransferFailedError';
  }
}

module.exports = TransferFailedError;