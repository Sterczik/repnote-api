'use strict'

const HTTPStatus = require('http-status')
const TrainingQuery = use('App/Queries/TrainingQuery')

class TrainingController {
  async getTrainings({ request, response }) {
    try {
      const trainings = await TrainingQuery.getAll()

      return response.status(HTTPStatus.OK).json(trainings)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async getTraining({ request, response }) {
    try {
      const training = await TrainingQuery.getOne(request.params.id)

      if (training) {
        return response.status(HTTPStatus.OK).json(training)
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

  async remove({ request, response }) {
    try {
      const training = await TrainingQuery.getOne(request.params.id)

      if (training) {
        await TrainingQuery.remove(training)

        return response.status(HTTPStatus.OK).json(training)
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

module.exports = TrainingController
