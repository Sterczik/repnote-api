'use strict'

const HTTPStatus = require('http-status')
const UserQuery = use('App/Queries/UserQuery')

class UserController {
  async getUsers({ request, response }) {
    try {
      const users = await UserQuery.getAll()

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
      const user = await UserQuery.getOne(request.params.id)

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

  async removeUser({ request, response }) {
    try {
      const user = await UserQuery.getOne(request.params.id)

      if (user) {
        await UserQuery.remove(user)

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
