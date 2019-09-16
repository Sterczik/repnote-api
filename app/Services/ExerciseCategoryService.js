'use strict'

const ExerciseCategory = use('App/Models/ExerciseCategory')

const ExerciseCategoryService = {
  async getAll() {
    const categories = await ExerciseCategory
      .all()

    return categories
  },
  async getOne(id) {
    const category = await ExerciseCategory
      .query()
      .where('id', id)
      .first()

    return category
  },
  async create(data) {
    const category = await ExerciseCategory
      .create(data)

    return category
  },
  async remove(category) {
    await category.delete()
  }
}

module.exports = ExerciseCategoryService
