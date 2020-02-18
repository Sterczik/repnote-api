'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SubtrainingSchema extends Schema {
  up () {
    this.create('subtrainings', (table) => {
      table.increments()
      table.string('name')
      table.integer('training_id').unsigned().references('id').inTable('trainings').onDelete('cascade').onUpdate('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('subtrainings')
  }
}

module.exports = SubtrainingSchema
