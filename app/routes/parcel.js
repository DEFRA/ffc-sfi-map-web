const { getParcelCovers } = require('../api')

module.exports = {
  method: 'GET',
  path: '/parcel',
  options: {
    handler: async (request, h) => {
      const { sbi, sheetId, parcelId, mapStyle } = request.query
      const { parcels, center, totalArea, covers } = await getParcelCovers(sbi, sheetId, parcelId)
      return h.view('parcel', { sbi, sheetId, parcelId, parcels, center, totalArea, covers, mapStyle })
    }
  }
}
