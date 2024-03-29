'use strict'

const HTTPStatus = require('http-status')
const { validate } = use('Validator')
const TrainingQuery = use('App/Queries/TrainingQuery')
const TrainingCategoryQuery = use('App/Queries/TrainingCategoryQuery')
const TrainingAdvancementLevelQuery = use('App/Queries/TrainingAdvancementLevelQuery')
const TrainingLikeQuery = use('App/Queries/TrainingLikeQuery')

const Subtraining = use('App/Models/Subtraining')
const Exercise = use('App/Models/Exercise')
const ExerciseCategory = use('App/Models/ExerciseCategory')

class TrainingController {
  async getAll({ request, response }) {
    try {
      let { perPage, page, sort, search, categoryFilter, advancementLevelFilter } = request.only([
        'perPage',
        'page',
        'sort',
        'search',
        'categoryFilter',
        'advancementLevelFilter'
      ])

      perPage = parseInt(perPage) || 24
      page = parseInt(page) || 1
      if (sort == '1') {
        sort = 'created_at'
      } else {
        sort = 'likes_count'
      }
      search = `%${decodeURIComponent(search)}%` || ''
      categoryFilter = parseInt(categoryFilter) || 0
      if (!categoryFilter) {
        categoryFilter = null
      }
      advancementLevelFilter = parseInt(advancementLevelFilter) || 0
      if (!advancementLevelFilter) {
        advancementLevelFilter = null
      }

      const trainingsInfo = await TrainingQuery.getAllWithPagination(page, perPage, search, sort, categoryFilter, advancementLevelFilter)

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

      let user = null
      let like = null
      try {
        if (await auth.getUser()) {
          user = await auth.getUser()
          like = await TrainingLikeQuery.get(user.id, training.id)
        }
      } catch(err) {}

      if (training) {
        if (training.private === false) {
          training.liked = Boolean(like)
          if (user) {
            if (training['user_id'] == user.id) {
              training.isOwner = true
              return response.status(HTTPStatus.OK).json(training)
            }
            training.isOwner = false
            return response.status(HTTPStatus.OK).json(training)
          }
          training.isOwner = false
          return response.status(HTTPStatus.OK).json(training)
        } else {
          if (user) {
            if (training['user_id'] == user.id) {
              training.isOwner = true
              return response.status(HTTPStatus.OK).json(training)
            }
            return response.status(HTTPStatus.UNAUTHORIZED).json({ message: 'You have no permissions to manage this Training.' })
          }
          return response.status(HTTPStatus.UNAUTHORIZED).json({ message: 'You have no permissions to manage this Training.' })
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
            message: 'Validation error.'
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
        'subtrainings'
      ])

      if (trainingData.subtrainings.length > 10) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: 'You have too many subtrainings in Training'
          }
        })
      }

      trainingData.subtrainings.forEach((subtraining) => {
        if (subtraining.exercises.length > 10) {
          return response.status(HTTPStatus.BAD_REQUEST).json({
            success: false,
            errors: {
              message: 'You have too many exercises in Training'
            }
          })
        }
        subtraining.exercises.forEach((exercise) => {
          if (exercise.rounds.length > 20) {
            return response.status(HTTPStatus.BAD_REQUEST).json({
              success: false,
              errors: {
                message: 'You have too many rounds in exercises'
              }
            })
          }
        })
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

      trainingData.subtrainings.forEach(async (subtraining) => {
        const subtrainingContainer = await Subtraining.create({
          name: subtraining.name
        })

        await subtrainingContainer
          .training()
          .associate(training)

        subtraining.exercises.forEach(async (exercise) => {
          const exerciseContainer = await Exercise.create({
            name: exercise.name
          })

          const exerciseCategory = await ExerciseCategory
            .query()
            .where('id', exercise.category_id)
            .first()

          await exerciseContainer
            .category()
            .associate(exerciseCategory)

          await exerciseContainer
            .subtraining()
            .associate(subtrainingContainer)

          await exerciseContainer
            .rounds()
            .createMany(exercise.rounds)
        })
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
      const validation = await validate(request.only([
        'name',
        'private',
        'description',
        'goal',
        'days_per_week'
      ]), {
        name: 'required|min:5|max:60',
        private: 'required',
        description: 'required',
        goal: 'required',
        days_per_week: 'required'
      })

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: 'Validation error.'
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
        'subtrainings'
      ])

      if (trainingData.subtrainings.length > 10) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: 'You have too many subtrainings in Training'
          }
        })
      }

      trainingData.subtrainings.forEach((subtraining) => {
        if (subtraining.exercises.length > 10) {
          return response.status(HTTPStatus.BAD_REQUEST).json({
            success: false,
            errors: {
              message: 'You have too many exercises in Training'
            }
          })
        }
        subtraining.exercises.forEach((exercise) => {
          if (exercise.rounds.length > 20) {
            return response.status(HTTPStatus.BAD_REQUEST).json({
              success: false,
              errors: {
                message: 'You have too many rounds in exercises'
              }
            })
          }
        })
      })

      const category = await TrainingCategoryQuery.getOne(trainingData.category)
      const advancementLevel = await TrainingAdvancementLevelQuery.getOne(trainingData.advancementLevel)

      await TrainingQuery
        .update(request.params.id, {
          name: trainingData.name,
          private: trainingData.private,
          description: trainingData.description,
          goal: trainingData.goal,
          days_per_week: trainingData.days_per_week
        })

      const training = await TrainingQuery.getOne(request.params.id)

      await training
        .category()
        .associate(category)

      await training
        .advancementLevel()
        .associate(advancementLevel)

      await training.subtrainings().delete()

      trainingData.subtrainings.forEach(async (subtraining) => {
        const subtrainingContainer = await Subtraining.create({
          name: subtraining.name
        })

        await subtrainingContainer
          .training()
          .associate(training)

        subtraining.exercises.forEach(async (exercise) => {
          const exerciseContainer = await Exercise.create({
            name: exercise.name
          })

          const exerciseCategory = await ExerciseCategory
            .query()
            .where('id', exercise.category_id)
            .first()

          await exerciseContainer
            .category()
            .associate(exerciseCategory)

          await exerciseContainer
            .subtraining()
            .associate(subtrainingContainer)

          await exerciseContainer
            .rounds()
            .createMany(exercise.rounds)
        })
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

  async switchStatus({ request, response, auth }) {
    try {
      const user = await auth.getUser()
      const training = await TrainingQuery.getOne(request.params.id)

      if (training) {
        if (training['user_id'] == user.id) {
          training.private = !training.private

          await training.save()
          return response.status(HTTPStatus.OK).json({
            private: training.private
          })
        }
        return response.status(HTTPStatus.UNAUTHORIZED).json({ message: 'You have no permissions to manage this Training.' })
      }
      return response.status(HTTPStatus.NOT_FOUND).json({ message: 'Not found.' })
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
        return response.status(HTTPStatus.UNAUTHORIZED).json({ message: 'You have no permissions to manage this Training.' })
      }
      return response.status(HTTPStatus.NOT_FOUND).json({ message: 'Not found.' })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async clone({ request, response, auth }) {
    try {
      const user = await auth.getUser()
      const trainingToClone = await TrainingQuery.getOne(request.params.id)

      if (trainingToClone && user) {
        const trainingToCloneJSON = await trainingToClone.toJSON()

        const category = await TrainingCategoryQuery.getOne(trainingToCloneJSON.category.id)
        const advancementLevel = await TrainingAdvancementLevelQuery.getOne(trainingToCloneJSON.advancementLevel.id)

        const clonedTraining = await TrainingQuery
          .create({
            name: trainingToCloneJSON.name,
            private: true,
            description: trainingToCloneJSON.description,
            goal: trainingToCloneJSON.goal,
            days_per_week: trainingToCloneJSON.days_per_week
          })

        await clonedTraining
          .category()
          .associate(category)

        await clonedTraining
          .advancementLevel()
          .associate(advancementLevel)

        await clonedTraining
          .user()
          .associate(user)

        trainingToCloneJSON.subtrainings.forEach(async (subtraining) => {
          const subtrainingContainer = await Subtraining.create({
            name: subtraining.name
          })

          await subtrainingContainer
            .training()
            .associate(clonedTraining)

          subtraining.exercises.forEach(async (exercise) => {
            const exerciseContainer = await Exercise.create({
              name: exercise.name
            })

            const exerciseCategory = await ExerciseCategory
              .query()
              .where('id', exercise.category_id)
              .first()

            await exerciseContainer
              .category()
              .associate(exerciseCategory)

            await exerciseContainer
              .subtraining()
              .associate(subtrainingContainer)

            const mappedRounds = exercise.rounds.map((round) => {
              return {
                reps: round.reps,
                weight: round.weight
              }
            })

            await exerciseContainer
              .rounds()
              .createMany(mappedRounds)
          })
        })

        await clonedTraining.save()

        const trainingToFind = await TrainingQuery.getOne(clonedTraining.id)
        if (trainingToFind) {
          return response.status(HTTPStatus.OK).json(clonedTraining)
        }
      }
      return response.status(HTTPStatus.NOT_FOUND).json({ message: 'Not found.' })
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
