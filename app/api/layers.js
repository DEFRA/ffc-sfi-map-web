const base = require('./base')

const getLayers = async (url, token) => {
  return base.get(url, token)
}

const postLayers = async (url, data, token) => {
  return base.post(url, data, token)
}

module.exports = {
  getLayers,
  postLayers
}
