'use strict'

const TrainingLike = use('App/Models/TrainingLike')

const TrainingLikeQuery = {
  async get(userId, trainingId) {
    const like = await TrainingLike
      .query()
      .where('user_id', userId)
      .where('training_id', trainingId)
      .first()

    return like
  },
  async create(userId, trainingId) {
    const like = await TrainingLike.findOrCreate(
      { user_id: userId, training_id: trainingId },
      { user_id: userId, training_id: trainingId }
    )
    return like
  },
  async remove(userId, trainingId) {
    await TrainingLike.query()
      .where('user_id', userId)
      .where('training_id', trainingId)
      .delete()
  }
}

module.exports = TrainingLikeQuery
