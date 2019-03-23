'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Training extends Model {
  static formatDates (field, value) {
    if (field === 'dob') {
      return value.format('DD-MM-YYYY')
    }
    return super.formatDates(field, value)
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
  category () {
    return this.belongsTo('App/Models/TrainingCategory')
  }
  exercises () {
    return this.hasMany('App/Models/Exercise')
  }
}

module.exports = Training
