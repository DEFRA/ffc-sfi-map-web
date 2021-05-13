const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/cookies')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
