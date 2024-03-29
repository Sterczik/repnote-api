'use strict'

const HTTPStatus = require('http-status')
const TrainingCategoryQuery = use('App/Queries/TrainingCategoryQuery')
const { validate } = use('Validator')

class TrainingCategoryController {
  async getTrainingCategories({ request, response }) {
    try {
      const categories = await TrainingCategoryQuery.getAll()

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
      const category = await TrainingCategoryQuery.getOne(request.params.id)

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
            message: 'Validation error.'
          }
        })
      }

      const category = await TrainingCategoryQuery.create(inputData)

      return response.status(HTTPStatus.CREATED).json(category)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async editTrainingCategory({ request, response }) {
    try {
      const data = request.only(['name'])

      await TrainingCategoryQuery.edit(request.params.id, data)
      const updatedCategory = await TrainingCategoryQuery.getOne(request.params.id)

      if (updatedCategory) {
        return response.status(HTTPStatus.OK)
        .json(updatedCategory)
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

  async removeTrainingCategory({ request, response }) {
    try {
      const category = await TrainingCategoryQuery.getOne(request.params.id)

      if (category) {
        await TrainingCategoryQuery.remove(category)

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
