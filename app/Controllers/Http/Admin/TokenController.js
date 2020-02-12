'use strict'

const HTTPStatus = require('http-status')
const TokenQuery = use('App/Queries/TokenQuery')

class TokenController {
  async getTokens({ request, response }) {
    try {
      const tokens = await TokenQuery.getAll()

      return response.status(HTTPStatus.OK).json(tokens)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async removeToken({ request, response }) {
    try {
      const token = await TokenQuery.getOne(request.params.id)

      if (token) {
        await TokenQuery.remove(token)

        return response.status(HTTPStatus.OK).json(token)
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

module.exports = TokenController
