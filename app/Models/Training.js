'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Training extends Model {
  static boot() {
    super.boot()

    this.addTrait('@provider:Lucid/OptionalQueries')
  }
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
  likes () {
    return this.hasMany('App/Models/TrainingLike', 'id', 'training_id')
  }
  advancementLevel () {
    return this.belongsTo('App/Models/TrainingAdvancementLevel', 'advancement_level_id', 'id')
  }
}

module.exports = Training
