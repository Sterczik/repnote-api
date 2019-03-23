'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrainingCategory extends Model {
  trainings () {
    return this.hasMany('App/Models/Training')
  }
}

module.exports = TrainingCategory
