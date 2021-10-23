const { getLandParcels, getLandCovers } = require('../api')
const turf = require('@turf/turf')
const config = require('../config')

module.exports = {
  method: 'GET',
  path: '/land-cover',
  options: {
    handler: async (request, h) => {
      const { sbi } = request.query
      const landParcels = await getLandParcels(sbi)
      const featureCollection = {
        type: 'FeatureCollection',
        crs: { type: 'name', properties: { name: 'EPSG:27700' } },
        features: []
      }

      for (const landParcel of landParcels.features) {
        const sheetId = landParcel.properties.sheet_id
        const parcelId = landParcel.properties.parcel_id
        const landcover = await getLandCovers(sbi, sheetId, parcelId)
        featureCollection.features = [...featureCollection.features, ...landcover.features]
      }

      const centroid = turf.centroid(featureCollection)
      const center = centroid.geometry.coordinates
      const totalArea = featureCollection.features.reduce((x, y) => x + y.properties.area_ha, 0)
      const covers = featureCollection.features.map(x => x.properties)

      let { mapStyle } = request.query
      const apiKey = config.osMapApiKey || ''
      mapStyle = mapStyle || 'Road_27700'

      covers.sort((a, b) => (a.description > b.description) ? 1 : -1)

      return h.view('land-cover', { apiKey, sbi, sheetId: 0, parcelId: 0, parcels: featureCollection, center, totalArea, covers, mapStyle })
    }
  }
}
