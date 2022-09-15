let claims = []

const addClaim = (account) => {
  claims.push(account)
}

const drainClaims = (claimsCount) => {
  const drainedClaims =  claims.slice(0, claimsCount)
  claims = claims.slice(claimsCount)
  return drainedClaims
}

const drainAllClaims = () => drainClaims(claims.length)

// Would probably update whatever is doing account / user management to track claims here
const hasClaim = (account) => claims.indexOf(account) > -1

module.exports = {
  addClaim,
  drainClaims,
  hasClaim,
  drainAllClaims,
}