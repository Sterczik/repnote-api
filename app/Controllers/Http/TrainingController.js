'use strict'

const HTTPStatus = require('http-status')
const { validate } = use('Validator')
const TrainingQuery = use('App/Queries/TrainingQuery')
const TrainingCategoryQuery = use('App/Queries/TrainingCategoryQuery')
const TrainingAdvancementLevelQuery = use('App/Queries/TrainingAdvancementLevelQuery')

const Exercise = use('App/Models/Exercise')
const Round = use('App/Models/Round')
const ExerciseCategory = use('App/Models/ExerciseCategory')

class TrainingController {
  async getAll({ request, response }) {
    try {
      let { perPage, page, sort, search } = request.only(['perPage', 'page', 'sort', 'search'])

      perPage = parseInt(perPage) || 24
      page = parseInt(page) || 1
      sort = parseInt(sort) || 1
      search = `%${decodeURIComponent(search)}%` || ''

      const trainingsInfo = await TrainingQuery.getAllWithPagination(page, perPage, search)

      return response.status(HTTPStatus.OK).json(trainingsInfo)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async getOne({ request, response, auth }) {
    try {
      const training = await TrainingQuery.getOne(request.params.id)

      let user = ''
      try {
        if (await auth.getUser()) {
          user = await auth.getUser()
        }
      } catch(e) {}

      if (training) {
        if (training.private === false) {
          if (user) {
            if (training['user_id'] == user.id) {
              training.edit = true
              return response.status(HTTPStatus.OK).json(training)
            }
            training.edit = false
            return response.status(HTTPStatus.OK).json(training)
          }
          training.edit = false
          return response.status(HTTPStatus.OK).json(training)
        } else {
          if (user) {
            if (training['user_id'] == user.id) {
              training.edit = true
              return response.status(HTTPStatus.OK).json(training)
            }
            return response.status(HTTPStatus.UNAUTHORIZED).json({ message: "You have no permissions to manage this Training." })
          }
          return response.status(HTTPStatus.UNAUTHORIZED).json({ message: "You have no permissions to manage this Training." })
        }
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

  async create({ request, response, auth }) {
    try {
      const user = await auth.getUser()

      const validation = await validate(request.only([
        'name',
        'private',
        'description',
        'goal',
        'days_per_week'
      ]), {
        name: 'required|min:5|max:60|unique:trainings',
        private: 'required',
        description: 'required',
        goal: 'required',
        days_per_week: 'required'
      })

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: validation.messages()
          }
        })
      }

      const trainingData = request.only([
        'name',
        'private',
        'description',
        'goal',
        'days_per_week',
        'category',
        'advancementLevel',
        'exercises'
      ])

      if (trainingData.exercises.length > 10) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: "You have too many exercises in Training"
          }
        })
      }

      trainingData.exercises.forEach((exercise) => {
        if (exercise.rounds.length > 20) {
          return response.status(HTTPStatus.BAD_REQUEST).json({
            success: false,
            errors: {
              message: "You have too many rounds in exercises"
            }
          })
        }
      })

      const category = await TrainingCategoryQuery.getOne(trainingData.category)
      const advancementLevel = await TrainingAdvancementLevelQuery.getOne(trainingData.advancementLevel)

      const training = await TrainingQuery
        .create({
          name: trainingData.name,
          private: trainingData.private,
          description: trainingData.description,
          goal: trainingData.goal,
          days_per_week: trainingData.days_per_week
        })

      await training
        .category()
        .associate(category)

      await training
        .advancementLevel()
        .associate(advancementLevel)

      await training
        .user()
        .associate(user)

      trainingData.exercises.forEach(async (exercise) => {
        const exerciseContainer = await Exercise.create({
          name: exercise.name
        })

        const exerciseCategory = await ExerciseCategory
          .query()
          .where('id', exercise.category)
          .first()

        await exerciseContainer
          .category()
          .associate(exerciseCategory)

        await exerciseContainer
          .training()
          .associate(training)

        await exerciseContainer
          .rounds()
          .createMany(exercise.rounds)
      })

      await training.save()

      // Training is saved, now it's time to retrieve it from database with all information

      const trainingToFind = await TrainingQuery.getOne(training.id)

      if (trainingToFind) {
        return response.status(HTTPStatus.OK).json(trainingToFind)
      }
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async update({ request, response, auth }) {
    try {
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

      const trainingData = request.only(['name', 'private', 'description', 'goal'])

      const training = await TrainingQuery.update(request.params.id, {
        name: trainingData.name,
        private: trainingData.private,
        description: trainingData.description,
        goal: trainingData.goal
      })

      return response.status(HTTPStatus.OK).json(training)
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
      const training = await TrainingQuery.toggleStatus(request.params.id)

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
      const training = await TrainingQuery.getOne(request.params.id)
      if (training) {
        if (training['user_id'] == user.id) {
          await TrainingQuery.remove(training)
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
