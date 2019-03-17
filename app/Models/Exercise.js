'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Exercise extends Model {
  training () {
    return this.belongsTo('App/Models/Training')
  }
  rounds () {
    return this.hasMany('App/Models/Round')
  }
}

module.exports = Exercise
