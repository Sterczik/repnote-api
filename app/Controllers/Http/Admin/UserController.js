'use strict'

const HTTPStatus = require('http-status')
const UserService = use('App/Services/UserService')

class UserController {
  async getUsers({ request, response }) {
    try {
      const users = await UserService.getAll()

      return response.status(HTTPStatus.OK)
      .json({
        success: true,
        message: 'You successfully fetched users.',
        users
      })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!'
      })
    }
  }

  async getUser({ request, response }) {
    try {
      const user = await UserService.getOne(request.params.id)

      if (user) {
        return response.status(HTTPStatus.OK).json(user)
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

module.exports = UserController
