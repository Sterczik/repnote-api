'use strict'

const HTTPStatus = require('http-status')
const ContactQuery = use('App/Queries/ContactQuery')
const { validate } = use('Validator')

class ContactController {
  async sendMessage({ request, response }) {
    try {
      const inputData = request.only(['name', 'email', 'message'])

      const validation = await validate(request.only(['name', 'email', 'message']), {
        name: 'required',
        email: 'required',
        message: 'required'
      })

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: 'Validation error.'
          }
        })
      }

      await ContactQuery.create(inputData)

      return response.status(HTTPStatus.CREATED).json({
        status: 'success'
      })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error'
      })
    }
  }
}

module.exports = ContactController
