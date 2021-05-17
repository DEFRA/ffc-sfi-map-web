const { getParcels } = require('../api')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    handler: async (request, h) => {
      const sbi = request.query.sbi
      const parcels = await getParcels(sbi)
      return h.view('map', { sbi, parcels })
    }
  }
}
