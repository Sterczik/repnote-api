'use strict'

/*
|--------------------------------------------------------------------------
| TrainingAdvancementLevelSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const TrainingAdvancementLevel = use('App/Models/TrainingAdvancementLevel')
const Database = use('Database')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class TrainingAdvancementLevelSeeder {
  async run () {

    await TrainingAdvancementLevel.create({ name: 'Beginner' })
    await TrainingAdvancementLevel.create({ name: 'Intermediate' })
    await TrainingAdvancementLevel.create({ name: 'Advanced' })

    Database.close()
  }
}

module.exports = TrainingAdvancementLevelSeeder
