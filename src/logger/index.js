//Proper lib would be used here depending on deployment platform
const logger = {
  log : console.log,
  trace : console.log,
  info : console.log,
  warn : console.warn,
  error : console.error,
}

module.exports = logger;