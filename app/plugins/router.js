const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/cookies'),
  require('../routes/home'),
  require('../routes/static'),
  require('../routes/search'),
  require('../routes/map'),
  require('../routes/parcel'),
  require('../routes/land-cover'),
  require('../routes/interactive-map'),
  require('../routes/map-land-cover')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
