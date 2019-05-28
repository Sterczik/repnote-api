'use strict'

const HTTPStatus = require('http-status')
const TrainingCategory = use('App/Models/TrainingCategory')
const { validate } = use('Validator')

class TrainingCategoryController {
  async getTrainingCategories({ request, response }) {
    try {
      const categories = await TrainingCategory.all()

      return response.status(HTTPStatus.OK).json(categories)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async getTrainingCategory({ request, response }) {
    try {
      const category = await TrainingCategory
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

  async addTrainingCategory({ request, response }) {
    try {
      const inputData = request.only(['name'])

      const validation = await validate(request.only(['name']), {
        name: 'required|unique:training_categories',
      })

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: validation.messages()
          }
        })
      }

      const category = await TrainingCategory.create(inputData)

      return response.status(HTTPStatus.CREATED).json(category)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async removeTrainingCategory({ request, response }) {
    try {
      const category = await TrainingCategory
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

module.exports = TrainingCategoryController
