'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseCategorySchema extends Schema {
  up () {
    this.create('exercise_categories', (table) => {
      table.increments()
      table.string('name')
      table.timestamps()
    })
  }

  down () {
    this.drop('exercise_categories')
  }
}

module.exports = ExerciseCategorySchema
