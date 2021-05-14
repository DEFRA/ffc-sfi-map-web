const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/cookies'),
  require('../routes/home'),
  require('../routes/static'),
  require('../routes/search'),
  require('../routes/map')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
