const base = require('./base')
const config = require('../config')

const getParcels = async (sbi) => {
  const url = `${config.publicApi}LandCovers/MapServer/0/query?where=SBI=${sbi}&outFields=*&outSR=27700&f=geojson`
  return base.get(url)
}

module.exports = {
  getParcels
}
