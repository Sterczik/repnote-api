'use strict'

const HTTPStatus = require('http-status')
const ExerciseCategoryQuery = use('App/Queries/ExerciseCategoryQuery')

class ExerciseCategoryController {
  async getExerciseCategories({ request, response }) {
    try {
      const categories = await ExerciseCategoryQuery.getAll()

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
