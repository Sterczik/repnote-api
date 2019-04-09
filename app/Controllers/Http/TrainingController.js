'use strict'

const HTTPStatus = require('http-status')
const Training = use('App/Models/Training')
const Exercise = use('App/Models/Exercise')
const Round = use('App/Models/Round')
const TrainingCategory = use('App/Models/TrainingCategory')
const { validate } = use('Validator')

class TrainingController {
  async getAll({ request, response }) {
    try {
      const trainings = await Training
        .query()
        .with('user')
        .with('category')
        .with('exercises')
        .with('exercises.rounds')
        .where('private', false)
        .fetch()

      return response.status(HTTPStatus.OK).json(trainings)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async getMyTrainings({ request, response, auth }) {
    const user = await auth.getUser()

    const trainings = await Training
      .query()
      .with('user')
      .with('category')
      .with('exercises')
      .with('exercises.rounds')
      .where('user_id', user.id)
      .fetch()

    return response.status(HTTPStatus.OK).json(trainings)
  }

  async getOne({ request, response, auth }) {
    const training = await Training
      .query()
      .with('user')
      .with('category')
      .with('exercises')
      .with('exercises.rounds')
      .where('id', request.params.id)
      .first()

    if (training) {
      return response.status(HTTPStatus.OK).json(training)
    }
    return response.status(HTTPStatus.NOT_FOUND).json(HTTPStatus.NOT_FOUND)
  }

  async create({ request, response, auth }) {
    try {
      const user = await auth.getUser()

      const validation = await validate(request.only(['name', 'private', 'description', 'goal']), {
        name: 'required|min:5|max:60|unique:trainings',
        private: 'required',
        description: 'required',
        goal: 'required'
      })

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: validation.messages()
          }
        })
      }

      const trainingData = request.only(['name', 'private', 'category', 'exercises'])

      const category = await TrainingCategory
        .query()
        .where('id', trainingData.category)
        .first()

      const training = await Training.create({
        name: trainingData.name,
        private: trainingData.private,
        description: trainingData.description,
        goal: trainingData.goal
      })

      await training
        .category()
        .associate(category)

      await training
        .user()
        .associate(user)

      trainingData.exercises.forEach(async (exercise) => {
        const exerciseContainer = await Exercise.create({
          name: exercise.name
        })

        await exerciseContainer
          .training()
          .associate(training)

        await exerciseContainer
          .rounds()
          .createMany(exercise.rounds)
      })

      await training.save()

      // Training is saved, now it's time to retrieve it from database with all information

      const trainingToFind = await Training
        .query()
        .with('user')
        .with('category')
        .with('exercises')
        .with('exercises.rounds')
        .where('id', training.id)
        .first()

      if (trainingToFind) {
        return response.status(HTTPStatus.OK).json(trainingToFind);
      }
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async switchStatus({ request, response, auth }) {
    try {
      const user = await auth.getUser()
      const training = await Training
        .query()
        .with('user')
        .with('category')
        .with('exercises')
        .with('exercises.rounds')
        .where('id', request.params.id)
        .first()

      if (training) {
        if (training['user_id'] == user.id) {
          training.private = !training.private

          await training.save()
          return response.status(HTTPStatus.OK).json(training)
        }
        return response.status(HTTPStatus.UNAUTHORIZED).json({ message: "You have no permissions to manage this Training." })
      }
      return response.status(HTTPStatus.NOT_FOUND).json({ message: "Not found." })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async remove({ request, response, auth }) {
    try {
      const user = await auth.getUser()
      const training = await Training
        .query()
        .with('user')
        .with('category')
        .with('exercises')
        .with('exercises.rounds')
        .where('id', request.params.id)
        .first()

      if (training) {
        if (training['user_id'] == user.id) {
          await training.delete()
          return response.status(HTTPStatus.OK).json(training)
        }
        return response.status(HTTPStatus.UNAUTHORIZED).json({ message: "You have no permissions to manage this Training." })
      }
      return response.status(HTTPStatus.NOT_FOUND).json({ message: "Not found." })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }
}

module.exports = TrainingController
