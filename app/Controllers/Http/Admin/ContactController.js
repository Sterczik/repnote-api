'use strict'

const HTTPStatus = require('http-status')
const Contact = use('App/Models/Contact')

class ContactController {
  async getMessages({ request, response }) {
    try {
      const messages = await Contact.all()

      return response.status(HTTPStatus.OK).json(messages)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }
}

module.exports = ContactController
