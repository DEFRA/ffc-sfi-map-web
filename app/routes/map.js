const { getParcels } = require('../api')
const turf = require('@turf/turf')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    handler: async (request, h) => {
      const sbi = request.query.sbi
      const parcels = await getParcels(sbi)

      var centroid = turf.centroid(parcels)
      const center = centroid.geometry.coordinates

      return h.view('map', { sbi, parcels, center })
    }
  }
}
