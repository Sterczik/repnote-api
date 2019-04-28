'use strict'

const HTTPStatus = require('http-status')
const Training = use('App/Models/Training')

class TrainingController {
  async getTrainings({ request, response }) {
    try {
      const trainings = await Training
        .query()
        .with('user')
        .with('category')
        .with('exercises')
        .with('exercises.rounds')
        .fetch()

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
      const training = await Training
      .query()
      .with('user')
      .with('category')
      .with('exercises')
      .with('exercises.rounds')
      .where('id', request.params.id)
      .first()

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
