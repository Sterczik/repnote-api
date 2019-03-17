'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Round extends Model {
  exercise () {
    return this.belongsTo('App/Models/Exercise')
  }
}

module.exports = Round
