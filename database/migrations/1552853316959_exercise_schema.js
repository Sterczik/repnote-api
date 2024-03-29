'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExerciseSchema extends Schema {
  up () {
    this.create('exercises', (table) => {
      table.increments()
      table.string('name')
      table.integer('subtraining_id').unsigned().references('id').inTable('subtrainings').onDelete('cascade').onUpdate('cascade')
      table.integer('category_id').unsigned().references('id').inTable('exercise_categories')
      table.timestamps()
    })
  }

  down () {
    this.drop('exercises')
  }
}

module.exports = ExerciseSchema
