'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ExerciseCategory extends Model {
  static get hidden () {
    return ['created_at', 'updated_at']
  }

  exercises () {
    return this.hasMany('App/Models/Exercise', 'id', 'category_id')
  }
}

module.exports = ExerciseCategory
