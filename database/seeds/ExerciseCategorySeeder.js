'use strict'

/*
|--------------------------------------------------------------------------
| ExerciseCategorySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const ExerciseCategory = use('App/Models/ExerciseCategory')
const Database = use('Database')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class ExerciseCategorySeeder {
  async run () {

    await ExerciseCategory.create({ name: 'Chest' })
    await ExerciseCategory.create({ name: 'Shoulders' })
    await ExerciseCategory.create({ name: 'Biceps' })
    await ExerciseCategory.create({ name: 'Triceps' })
    await ExerciseCategory.create({ name: 'Legs' })

    Database.close()
  }
}

module.exports = ExerciseCategorySeeder
