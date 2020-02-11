'use strict'

const HTTPStatus = require('http-status')
const ContactQuery = use('App/Queries/ContactQuery')

class ContactController {
  async getMessages({ request, response }) {
    try {
      const messages = await ContactQuery.getAll()

      return response.status(HTTPStatus.OK).json(messages)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async getMessage({ request, response }) {
    try {
      const message = await ContactQuery.getOne(request.params.id)

      if (message) {
        return response.status(HTTPStatus.OK).json(message)
      }
      return response.status(HTTPStatus.NOT_FOUND).json(HTTPStatus.NOT_FOUND)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async removeMessage({ request, response }) {
    try {
      const message = await ContactQuery.getOne(request.params.id)

      if (message) {
        await ContactQuery.remove(message)

        return response.status(HTTPStatus.OK).json(message)
      }
      return response.status(HTTPStatus.NOT_FOUND).json(HTTPStatus.NOT_FOUND)
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
