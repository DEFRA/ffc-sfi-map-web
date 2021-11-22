const { getParcels } = require('../api')
const config = require('../config')

module.exports = {
  method: 'GET',
  path: '/map-land-cover',
  options: {
    handler: async (request, h) => {
      const sbi = request.query.sbi
      const mapStyle = request.query.mapStyle || ''
      const apiKey = config.osMapApiKey || ''
      const { parcels, center } = await getParcels(sbi)
      return h.view('map-land-cover', { apiKey, sbi, parcels, center, mapStyle })
    }
  }
}
