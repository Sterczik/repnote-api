'use strict'

/*
|--------------------------------------------------------------------------
| TrainingCategorySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const TrainingCategory = use('App/Models/TrainingCategory')
const Database = use('Database')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class TrainingCategorySeeder {
  async run () {

    await TrainingCategory.create({ name: 'Gym' })
    await TrainingCategory.create({ name: 'Calisthenics' })
    await TrainingCategory.create({ name: 'Fitness' })
    await TrainingCategory.create({ name: 'Sports' })
    await TrainingCategory.create({ name: 'Mixed' })

    Database.close()
  }
}

module.exports = TrainingCategorySeeder
