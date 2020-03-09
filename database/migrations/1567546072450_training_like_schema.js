'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrainingLikeSchema extends Schema {
  up () {
    this.create('training_likes', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('cascade')
      table.integer('training_id').unsigned().notNullable().references('id').inTable('trainings').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('training_likes')
  }
}

module.exports = TrainingLikeSchema
