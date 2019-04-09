'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrainingCategory extends Model {
  static get hidden () {
    return ['created_at', 'updated_at']
  }

  trainings () {
    return this.hasMany('App/Models/Training', 'id', 'category_id')
  }
}

module.exports = TrainingCategory
