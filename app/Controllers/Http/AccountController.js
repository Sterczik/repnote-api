'use strict'

const HTTPStatus = require('http-status')
const User = use('App/Models/User')

class AccountController {
  async getMyProfile({ request, response, auth }) {
    try {
      const user = await auth.getUser()
      return response.status(HTTPStatus.OK)
        .json({
          success: true,
          message: 'You successfully fetched your profile.',
          user
        })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!'
      })
    }
  }

  async getProfile({ request, response }) {
    try {
      const slug = request.params.name
      const user = await User.findBy('slug', slug)

      if (user) {
        return response.status(HTTPStatus.OK)
        .json({
          success: true,
          message: 'You successfully fetched profile.',
          user
        })
      }
      return response.status(HTTPStatus.NOT_FOUND).json(HTTPStatus.NOT_FOUND)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!'
      })
    }
  }

  async getUserTrainings({ request, response }) {
    const slug = request.params.name
    const user = await User
      .query()
      .with('trainings', (builder) => {
        builder.where('private', false)
      })
      .where('slug', slug)
      .fetch()

    return response.status(HTTPStatus.OK).json(user.toJSON())
  }
}

module.exports = AccountController
