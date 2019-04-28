'use strict'

const HTTPStatus = require('http-status')
const User = use('App/Models/User')

class UserController {
  async getUsers({ request, response }) {
    try {
      const users = await User.all()

      return response.status(HTTPStatus.OK)
      .json({
        success: true,
        message: 'You successfully fetched profile.',
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
      const user = await User
        .query()
        .where('id', request.params.id)
        .first()

      if (user) {
        return response.status(HTTPStatus.OK).json(user)
      }
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
