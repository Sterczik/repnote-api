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
    return this.belongsTo('App/Models/User', 'user_id', 'id')
  }
  category () {
    return this.belongsTo('App/Models/TrainingCategory', 'category_id', 'id')
  }
  exercises () {
    return this.hasMany('App/Models/Exercise', 'id', 'training_id')
  }
}

module.exports = Training
