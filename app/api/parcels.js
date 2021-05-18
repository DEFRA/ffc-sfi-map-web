const base = require('./base')
const config = require('../config')
const turf = require('@turf/turf')

const getParcels = async (sbi) => {
  const url = `${config.publicApi}LandCovers/MapServer/0/query?where=SBI=${sbi}&outFields=*&outSR=27700&f=geojson`
  const parcels = await base.get(url)
  const centroid = turf.centroid(parcels)
  const center = centroid.geometry.coordinates
  return {
    parcels,
    center
  }
}

module.exports = {
  getParcels
}
