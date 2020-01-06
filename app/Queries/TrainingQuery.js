'use strict'

const Training = use('App/Models/Training')

const TrainingQuery = {
  async getAll() {
    const trainings = await Training
      .query()
      .with('user')
      .with('category')
      .with('advancementLevel')
      .with('exercises')
      .with('exercises.category')
      .with('exercises.rounds')
      .with('likes')
      .fetch()

    return trainings
  },
  async getAllWithPagination(page, perPage, search) {
    const trainings = await Training
      .query()
      .with('user')
      .with('category')
      .with('advancementLevel')
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
      .with('advancementLevel')
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
      .with('advancementLevel')
      .with('exercises')
      .with('exercises.category')
      .with('exercises.rounds')
      .with('likes')
      .where('id', id)
      .first()

    return training
  },
  async create(data) {
    const training = await Training
      .create({
        name: data.name,
        private: data.private,
        description: data.description,
        goal: data.goal
      })

    return training
  },
  async update(id, data) {
    const training = await Training
      .query()
      .where('id', id)
      .update({
        name: data.name,
        private: data.private,
        description: data.description,
        goal: data.goal
      })

    return training
  },
  async remove(training) {
    await training.delete()
  }
}

module.exports = TrainingQuery