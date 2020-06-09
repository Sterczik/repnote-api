'use strict'

const Admin = use('App/Models/Admin')

const AdminQuery = {
  async getOne(id) {
    const admin = await Admin
      .query()
      .where('id', id)
      .first()

    return admin
  },
  async changePassword(id, password) {
    const admin = await Admin
      .query()
      .where('id', id)
      .update({
        password
      })

    return admin
  }
}

module.exports = AdminQuery
