'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Subtraining extends Model {
  static get hidden () {
    return ['training_id', 'created_at', 'updated_at']
  }

  training () {
    return this.belongsTo('App/Models/Training', 'training_id', 'id')
  }
  exercises () {
    return this.hasMany('App/Models/Exercise', 'id', 'subtraining_id')
  }
}

module.exports = Subtraining
