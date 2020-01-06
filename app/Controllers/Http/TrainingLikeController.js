'use strict'

const HTTPStatus = require('http-status')
const TrainingLikeQuery = use('App/Queries/TrainingLikeQuery')

class TrainingLikeController {
  async create({ request, response, auth }) {
    try {
      const user = await auth.getUser()
      const like = await TrainingLikeQuery.create(user.id, request.params.id)

      return response.status(HTTPStatus.OK)
        .json({
          success: true,
          like
        })

    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!'
      })
    }
  }

  async remove({ request, response, auth }) {
    try {
      const user = await auth.getUser()
      await TrainingLikeQuery.remove(user.id, request.params.id)

      return response.status(HTTPStatus.OK)
        .json({
          success: true
        })

    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!'
      })
    }
  }
}

module.exports = TrainingLikeController
