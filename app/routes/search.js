const ViewModel = require('./models/search')
const schema = require('./schemas/sbi')

module.exports = [{
  method: 'GET',
  path: '/search',
  options: {
    handler: (request, h) => {
      return h.view('search', new ViewModel())
    }
  }
}, {
  method: 'POST',
  path: '/search',
  options: {
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        return h.view('search', new ViewModel(request.payload.sbi, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      return h.redirect(`map?sbi=${request.payload.sbi}`)
    }
  }
}]
