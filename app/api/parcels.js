const base = require('./base')
const config = require('../config')
const turf = require('@turf/turf')

const getParcels = async (sbi, parcelId) => {
  if (parcelId) {
    return getParcelsById(sbi, parcelId)
  }
  return getParcelsBySBI(sbi)
}

const getParcelsBySBI = async (sbi) => {
  const url = `${config.publicApi}LandCovers/MapServer/0/query?where=SBI=${sbi}&outFields=*&outSR=27700&f=geojson`
  const parcels = await base.get(url)
  const centroid = turf.centroid(parcels)
  const center = centroid.geometry.coordinates
  return {
    parcels,
    center
  }
}

const getParcelsById = async (sbi, parcelId) => {
  const { parcels } = await getParcelsBySBI(sbi)
  parcels.features = parcels.features.find(x => x.properties.id === parcelId)
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
