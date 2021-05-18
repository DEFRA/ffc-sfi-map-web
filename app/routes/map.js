const { getParcels } = require('../api')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    handler: async (request, h) => {
      const sbi = request.query.sbi
      const { parcels, center } = await getParcels(sbi)
      const featuresPI = []
      const featuresSI = []
      const featuresD = []
      parcels.features.map((feature) => featuresPI.push(feature.properties.parcel_id))
      parcels.features.map((feature) => featuresSI.push(feature.properties.sheet_id))
      parcels.features.map((feature) => featuresD.push(feature.properties.description))
      return h.view('map', { sbi, parcels, center, featuresPI, featuresSI, featuresD })
    }
  }
}
