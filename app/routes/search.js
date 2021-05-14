module.exports = [{
  method: 'GET',
  path: '/search',
  options: {
    handler: (request, h) => {
      return h.view('search')
    }
  }
}, {
  method: 'POST',
  path: '/search',
  options: {
    handler: (request, h) => {
      return h.redirect(`map?sbi=${request.payload.sbi}`)
    }
  }
}]
