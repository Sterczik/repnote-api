'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Round extends Model {
  static get hidden () {
    return ['exercise_id', 'created_at', 'updated_at']
  }

  exercise () {
    return this.belongsTo('App/Models/Exercise', 'exercise_id', 'id')
  }
}

module.exports = Round
