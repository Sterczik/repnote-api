'use strict'

const Training = use('App/Models/Training')

const TrainingService = {
  async getAll(page, perPage, search) {
    const trainings = await Training
      .query()
      .with('user')
      .with('category')
      .with('exercises')
      .with('exercises.category')
      .with('exercises.rounds')
      .with('likes')
      .where('private', false)
      .where('name', 'like', search)
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)

    return trainings
  },
  async getOne(id) {
    const training = await Training
      .query()
      .with('user')
      .with('category')
      .with('exercises')
      .with('exercises.category')
      .with('exercises.rounds')
      .with('likes')
      .where('id', id)
      .first()

    return training
  },
  async toggleStatus(id) {
    const training = await Training
      .query()
      .with('user')
      .with('category')
      .with('exercises')
      .with('exercises.category')
      .with('exercises.rounds')
      .with('likes')
      .where('id', id)
      .first()

    return training
  },
  async remove(id) {
    const training = await Training
      .query()
      .with('user')
      .with('category')
      .with('exercises')
      .with('exercises.category')
      .with('exercises.rounds')
      .with('likes')
      .where('id', id)
      .first()

    return training
  }
}

module.exports = TrainingService
