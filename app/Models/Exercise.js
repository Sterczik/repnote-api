'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Exercise extends Model {
  static get hidden () {
    return ['subtraining_id', 'created_at', 'updated_at']
  }

  subtraining () {
    return this.belongsTo('App/Models/Subtraining', 'subtraining_id', 'id')
  }
  category () {
    return this.belongsTo('App/Models/ExerciseCategory', 'category_id', 'id')
  }
  rounds () {
    return this.hasMany('App/Models/Round', 'id', 'exercise_id')
  }
}

module.exports = Exercise
