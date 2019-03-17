'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrainingCategorySchema extends Schema {
  up () {
    this.create('training_categories', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('training_categories')
  }
}

module.exports = TrainingCategorySchema
