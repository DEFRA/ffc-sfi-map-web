const { getParcels } = require('../api')
const config = require('../config')

module.exports = {
  method: 'GET',
  path: '/interactive-map',
  options: {
    handler: async (request, h) => {
      const sbi = request.query.sbi
      const mapStyle = request.query.mapStyle || ''
      const apiKey = config.osMapApiKey || ''
      const { parcels, center } = await getParcels(sbi)
      return h.view('interactive-map', { apiKey, sbi, parcels, center, mapStyle })
    }
  }
}
