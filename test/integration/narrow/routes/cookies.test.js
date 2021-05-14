describe('cookies route', () => {
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

  test('GET /cookies returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cookies'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('GET /cookies returns cookie policy', async () => {
    const options = {
      method: 'GET',
      url: '/cookies'
    }

    const result = await server.inject(options)
    expect(result.request.response.variety).toBe('view')
    expect(result.request.response.source.template).toBe('cookies/cookie-policy')
  })

  test('GET /cookies context includes Header', async () => {
    const options = {
      method: 'GET',
      url: '/cookies'
    }

    const result = await server.inject(options)
    expect(result.request.response._payload._data).toContain('Cookies')
  })

  test('POST /cookies returns 302 if not async', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      payload: { analytics: true }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(302)
  })

  test('POST /cookies returns 200 if async', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      payload: { analytics: true, async: true }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('POST /cookies invalid returns 400', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      payload: { invalid: 'aaaaaa' }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('POST /cookies redirects to GET with querystring', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      payload: { analytics: true }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(302)
    expect(result.headers.location).toBe('/cookies?updated=true')
  })
})
