const { getParcelCovers } = require('../api')
const config = require('../config')

module.exports = {
  method: 'GET',
  path: '/parcel',
  options: {
    handler: async (request, h) => {
      const { sbi, sheetId, parcelId, mapStyle } = request.query
      const apiKey = config.osMapApiKey
      const { parcels, center, totalArea, covers } = await getParcelCovers(sbi, sheetId, parcelId)
      return h.view('parcel', { apiKey, sbi, sheetId, parcelId, parcels, center, totalArea, covers, mapStyle })
    }
  }
}
