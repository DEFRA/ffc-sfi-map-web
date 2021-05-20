const { getParcels } = require('../api')
const config = require('../config')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    handler: async (request, h) => {
      const sbi = request.query.sbi
      const apiKey = config.osMapApiKey
      const { parcels, center } = await getParcels(sbi)
      return h.view('map', { apiKey, sbi, parcels, center })
    }
  }
}
