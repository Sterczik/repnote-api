'use strict'

/*
|--------------------------------------------------------------------------
| ZeroSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class ZeroSeeder {
  async run () {

    for (let i = 0; i < 100; i++) {
      const user = await Factory.model('App/Models/User').create()
      const training = await Factory.model('App/Models/Training').make()
      const subtraining = await Factory.model('App/Models/Subtraining').make()
      const exercise = await Factory.model('App/Models/Exercise').make()
      const round = await Factory.model('App/Models/Round').make()

      await user.trainings().save(training)
      await training.subtrainings().save(subtraining)
      await subtraining.exercises().save(exercise)
      await exercise.rounds().save(round)
    }

    for (let i = 0; i < 500; i++) {
      await Factory.model('App/Models/TrainingLike').create()
      await Factory.get('followers').create()
    }

    await Factory.model('App/Models/Contact').createMany(50)

  }
}

module.exports = ZeroSeeder
