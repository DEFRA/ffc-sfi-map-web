const base = require('./base')
const config = require('../config')
const turf = require('@turf/turf')

const getParcels = async (sbi) => {
  const url = `${config.publicApi}LandParcels/MapServer/0/query?where=SBI=${sbi}&outFields=*&outSR=27700&f=geojson`
  const parcels = await base.get(url)
  const centroid = turf.centroid(parcels)
  const center = centroid.geometry.coordinates
  console.log(parcels.features[0])
  return {
    parcels,
    center
  }
}

const getParcelCovers = async (sbi, sheetId, parcelId) => {
  const url = `${config.publicApi}LandCovers/MapServer/0/query?where=SBI=${sbi}&outFields=*&outSR=27700&f=geojson`
  const parcels = await base.get(url)
  parcels.features = parcels.features.filter(x => x.properties.sheet_id === sheetId && x.properties.parcel_id === parcelId)
  const centroid = turf.centroid(parcels)
  const center = centroid.geometry.coordinates
  return {
    parcels,
    center,
    totalArea: parcels.features.reduce((x, y) => x + y.properties.area_ha, 0),
    covers: parcels.features.map(x => x.properties)
  }
}

module.exports = {
  getParcels,
  getParcelCovers
}
