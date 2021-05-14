const createServer = require('./server')

createServer()
  .then(server => server.start())
  .catch(err => {
    console.error('App crashed', err)
    process.exit(1)
  })
