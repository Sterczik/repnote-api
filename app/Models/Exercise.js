'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Exercise extends Model {
  static get hidden () {
    return ['training_id', 'created_at', 'updated_at']
  }

  training () {
    return this.belongsTo('App/Models/Training', 'training_id', 'id')
  }
  rounds () {
    return this.hasMany('App/Models/Round', 'id', 'exercise_id')
  }
}

module.exports = Exercise
