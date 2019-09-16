'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrainingAdvancementLevelSchema extends Schema {
  up () {
    this.create('training_advancement_levels', (table) => {
      table.increments()
      table.string('name')
      table.timestamps()
    })
  }

  down () {
    this.drop('training_advancement_levels')
  }
}

module.exports = TrainingAdvancementLevelSchema
