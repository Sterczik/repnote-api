'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrainingLike extends Model {
  training () {
    return this.belongsTo('App/Models/Training')
  }
  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = TrainingLike
