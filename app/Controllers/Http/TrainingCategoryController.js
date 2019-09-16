'use strict'

const HTTPStatus = require('http-status')
const TrainingCategoryService = use('App/Services/TrainingCategoryService')

class TrainingCategoryController {
  async getTrainingCategories({ request, response }) {
    try {
      const categories = await TrainingCategoryService.getAll()

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

module.exports = TrainingCategoryController
