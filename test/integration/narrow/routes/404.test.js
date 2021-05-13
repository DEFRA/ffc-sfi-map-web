describe('404', () => {
  let createServer
  let server

  beforeEach(async () => {
    createServer = require('../../../../app/server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET invalid route returns 404', async () => {
    const options = {
      method: 'GET',
      url: '/this-is-not-real'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(404)
  })

  test('GET invalid route returns 404 view', async () => {
    const options = {
      method: 'GET',
      url: '/this-is-not-real'
    }

    const result = await server.inject(options)
    expect(result.request.response.variety).toBe('view')
    expect(result.request.response.source.template).toBe('404')
  })
})
