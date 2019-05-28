'use strict'

const HTTPStatus = require('http-status')
const ExerciseCategory = use('App/Models/ExerciseCategory')
const { validate } = use('Validator')

class ExerciseCategoryController {
  async getExerciseCategories({ request, response }) {
    try {
      const categories = await ExerciseCategory.all()

      return response.status(HTTPStatus.OK).json(categories)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async getExerciseCategory({ request, response }) {
    try {
      const category = await ExerciseCategory
        .query()
        .where('id', request.params.id)
        .first()

        if (category) {
          return response.status(HTTPStatus.OK).json(category)
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

  async addExerciseCategory({ request, response }) {
    try {
      const inputData = request.only(['name'])

      const validation = await validate(request.only(['name']), {
        name: 'required|unique:exercise_categories',
      })

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: validation.messages()
          }
        })
      }

      const category = await ExerciseCategory.create(inputData)

      return response.status(HTTPStatus.CREATED).json(category)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async removeExerciseCategory({ request, response }) {
    try {
      const category = await ExerciseCategory
        .query()
        .where('id', request.params.id)
        .first()

        if (category) {
          await category.delete()

          return response.status(HTTPStatus.OK).json(category)
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

module.exports = ExerciseCategoryController
