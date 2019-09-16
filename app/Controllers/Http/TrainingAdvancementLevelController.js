'use strict'

const HTTPStatus = require('http-status')
const TrainingAdvancementLevelService = use('App/Services/TrainingAdvancementLevelService')

class TrainingAdvancementLevelController {
  async getAdvancementLevels({ request, response }) {
    try {
      const levels = await TrainingAdvancementLevelService.getAll()

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
