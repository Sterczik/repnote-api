'use strict'

/*
|--------------------------------------------------------------------------
| TrainingSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Training = use('App/Models/Training')
const Database = use('Database')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class TrainingSeeder {
  async run () {

    const training = await Training.create({ name: 'Gym Training', private: false, 'user_id': 1, 'category_id': 1 })

    await training.exercises().create({ name: 'Exercise 1' })

    Database.close()
  }
}

module.exports = TrainingSeeder
