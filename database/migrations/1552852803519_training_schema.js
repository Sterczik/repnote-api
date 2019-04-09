'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrainingSchema extends Schema {
  up () {
    this.create('trainings', (table) => {
      table.increments()
      table.string('name')
      table.boolean('private').defaultTo(false)
      table.string('description')
      table.string('goal')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('category_id').unsigned().references('id').inTable('training_categories')
      table.timestamps()
    })
  }

  down () {
    this.drop('trainings')
  }
}

module.exports = TrainingSchema
