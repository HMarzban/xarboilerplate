const router = require('../../utils').router()
const valid = require('./search.validator')
const Search = require('./search.controller')

router.get('/healthCheck', 'Ok')

router.get('/', valid.search, async (req, res) => {
  const { artistName } = req.query
  return Search.albums(artistName)
})

module.exports = router.expressRouter
