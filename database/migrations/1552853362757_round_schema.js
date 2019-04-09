'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoundSchema extends Schema {
  up () {
    this.create('rounds', (table) => {
      table.increments()
      table.integer('reps')
      table.integer('weight')
      table.integer('exercise_id').unsigned().references('id').inTable('exercises').onDelete('cascade').onUpdate('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('rounds')
  }
}

module.exports = RoundSchema
