const express = require('express')
const router = express.Router();
const Logger = require('../logger')
const ClaimRegistry = require('../claimRegistry')

router.get('/', async (req, res) => res.status(200).json({ online: 'ok' }));
router.post('/claim-free-share', async (req, res) => {
  try{
    const account = req.body.account
    ClaimRegistry.addClaim(account)
    res.status(200).json({account})
  } catch (error) {
    Logger.error(error)
    res.status(500).send('Something went wrong')
  }
})

module.exports = router;