'use strict'

const HTTPStatus = require('http-status')
const TrainingAdvancementLevelQuery = use('App/Queries/TrainingAdvancementLevelQuery')
const { validate } = use('Validator')

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

  async getAdvancementLevel({ request, response }) {
    try {
      const level = await TrainingAdvancementLevelQuery.getOne(request.params.id)

      if (level) {
        return response.status(HTTPStatus.OK).json(level)
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

  async addAdvancementLevel({ request, response }) {
    try {
      const inputData = request.only(['name'])

      const validation = await validate(request.only(['name']), {
        name: 'required|unique:training_advancement_levels',
      })

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: validation.messages()
          }
        })
      }

      const level = await TrainingAdvancementLevelQuery.create(inputData)

      return response.status(HTTPStatus.CREATED).json(level)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async removeAdvancementLevel({ request, response }) {
    try {
      const level = await TrainingAdvancementLevelQuery.getOne(request.params.id)

      if (level) {
        await TrainingAdvancementLevelQuery.remove(level)

        return response.status(HTTPStatus.OK).json(level)
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

module.exports = TrainingAdvancementLevelController
