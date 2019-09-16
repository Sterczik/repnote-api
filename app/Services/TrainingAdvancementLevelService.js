'use strict'

const TrainingAdvancementLevel = use('App/Models/TrainingAdvancementLevel')

const TrainingAdvancementLevelService = {
  async getAll() {
    const levels = await TrainingAdvancementLevel
      .all()

    return levels
  },
  async getOne(id) {
    const level = await TrainingAdvancementLevel
      .query()
      .where('id', id)
      .first()

    return level
  },
  async create(data) {
    const level = await TrainingAdvancementLevel
      .create(data)

    return level
  },
  async remove(level) {
    await level.delete()
  }
}

module.exports = TrainingAdvancementLevelService
