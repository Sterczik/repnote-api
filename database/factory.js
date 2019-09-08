'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

// User
Factory.blueprint('App/Models/User', async (faker) => {
  return {
    name: faker.first() + ' ' + faker.last(),
    avatar: 'empty',
    username: faker.username(),
    email: faker.email(),
    description: faker.paragraph(),
    provider_id: faker.pickone(['1', '2', '3']),
    provider: faker.pickone(['local', 'facebook', 'google']),
    password: await Hash.make(faker.password()),
    slug: faker.first() + '-' + faker.last()
  }
})

// Training
Factory.blueprint('App/Models/Training', (faker) => {
  return {
    name: faker.sentence(),
    private: faker.bool(),
    description: faker.sentence(),
    goal: faker.sentence(),
    category_id: faker.integer({ min: 1, max: 3 })
  }
})

// Exercise
Factory.blueprint('App/Models/Exercise', (faker) => {
  return {
    name: faker.sentence(),
    category_id: faker.integer({ min: 1, max: 5 })
  }
})

// Round
Factory.blueprint('App/Models/Round', (faker) => {
  return {
    reps: faker.integer({ min: 1, max: 25 }),
    weight: faker.integer({ min: 5, max: 200 })
  }
})

// Contact
Factory.blueprint('App/Models/Contact', (faker) => {
  return {
    name: faker.first() + faker.last(),
    email: faker.email(),
    message: faker.paragraph()
  }
})

// TrainingLike
Factory.blueprint('App/Models/TrainingLike', (faker) => {
  return {
    user_id: faker.integer({ min: 1, max: 50 }),
    training_id: faker.integer({ min: 1, max: 50 })
  }
})

// Follower
Factory.blueprint('followers', (faker) => {
  return {
    user_id: faker.integer({ min: 1, max: 50 }),
    follower_id: faker.integer({ min: 1, max: 50 }),
  }
})
