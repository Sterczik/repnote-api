'use strict'

const HTTPStatus = require('http-status')
const TrainingAdvancementLevelQuery = use('App/Queries/TrainingAdvancementLevelQuery')

class TrainingAdvancementLevelController {
  async getAdvancementLevels({ request, response }) {
    try {
      const levels = await TrainingAdvancementLevelQuery.getAll()

      return response.status(HTTPStatus.OK).json(levels)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }
}

module.exports = TrainingAdvancementLevelController
