'use strict'

const HTTPStatus = require('http-status')
const ContactService = use('App/Services/ContactService')
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
          status: 'error',
          message: validation.messages()
        })
      }

      await ContactService.create(inputData)

      return response.status(HTTPStatus.CREATED).json({
        status: 'success',
        message: 'Message has sent successfully!'
      })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!'
      })
    }
  }
}

module.exports = ContactController
