'use strict'

const HTTPStatus = require('http-status')
const TrainingService = use('App/Services/TrainingService')

class TrainingController {
  async getTrainings({ request, response }) {
    try {
      const trainings = await TrainingService.getAll()

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
      const training = await TrainingService.getOne(request.params.id)

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
}

module.exports = TrainingController
