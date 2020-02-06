'use strict'

const User = use('App/Models/User')

const UserQuery = {
  async getAll() {
    const users = await User
      .all()

    return users
  },
  async getOne(id) {
    const user = await User
      .query()
      .where('id', id)
      .first()

    return user
  },
  async changePassword(id, password) {
    const user = await User
      .query()
      .where('id', id)
      .update({
        password
      })

    return user
  },
  async remove(user) {
    await user.delete()
  }
}

module.exports = UserQuery
