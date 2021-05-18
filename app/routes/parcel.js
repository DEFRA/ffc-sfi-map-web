const { getParcels } = require('../api')

module.exports = {
  method: 'GET',
  path: '/parcel',
  options: {
    handler: async (request, h) => {
      const { sbi, parcelId } = request.query
      const { parcels, center } = await getParcels(sbi, parcelId)
      return h.view('parcel', { sbi, parcelId, parcels, center })
    }
  }
}
