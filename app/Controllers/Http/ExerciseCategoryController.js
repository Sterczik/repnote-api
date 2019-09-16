'use strict'

const HTTPStatus = require('http-status')
const ExerciseCategoryService = use('App/Services/ExerciseCategoryService')

class ExerciseCategoryController {
  async getExerciseCategories({ request, response }) {
    try {
      const categories = await ExerciseCategoryService.getAll()

      return response.status(HTTPStatus.OK).json(categories)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }
}

module.exports = ExerciseCategoryController
