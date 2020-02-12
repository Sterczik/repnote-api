'use strict'

const TrainingCategory = use('App/Models/TrainingCategory')

const TrainingCategoryQuery = {
  async getAll() {
    const categories = await TrainingCategory
      .all()

    return categories
  },
  async getOne(id) {
    const category = await TrainingCategory
      .query()
      .where('id', id)
      .first()

    return category
  },
  async create(data) {
    const category = await TrainingCategory
      .create(data)

    return category
  },
  async edit(id, data) {
    const updatedCategory = await TrainingCategory
      .query()
      .where('id', id)
      .update({ name: data.name })

    return updatedCategory
  },
  async remove(category) {
    await category.delete()
  }
}

module.exports = TrainingCategoryQuery
