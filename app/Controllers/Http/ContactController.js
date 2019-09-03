'use strict'

const HTTPStatus = require('http-status')
const Contact = use('App/Models/Contact')
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
            message: validation.messages()
          }
        })
      }

      const message = await Contact.create(inputData)

      return response.status(HTTPStatus.CREATED).json(message)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!'
      })
    }
  }
}

module.exports = ContactController
