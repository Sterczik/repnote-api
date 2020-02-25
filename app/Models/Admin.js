'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class Admin extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the admin password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (adminInstance) => {
      if (adminInstance.dirty.password) {
        adminInstance.password = await Hash.make(adminInstance.password)
      }
    })
  }

  static get hidden () {
    return ['password', 'created_at', 'updated_at']
  }

  static formatDates (field, value) {
    if (field === 'dob') {
      return value.format('DD-MM-YYYY')
    }
    return super.formatDates(field, value)
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }
}

module.exports = Admin
