const { getParcels } = require('../api')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    handler: async (request, h) => {
      const sbi = request.query.sbi
      const { parcels, center } = await getParcels(sbi)
      const features = []
      parcels.features.map((feature) => features.push(feature.properties.sbi ))
      console.log(features)
      return h.view('map', { sbi, parcels, center, features })
    }
  }
}
