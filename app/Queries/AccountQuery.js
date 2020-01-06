'use strict'

const User = use('App/Models/User')

const AccountQuery = {
  async getProfile(id) {
    const profile = await User
      .query()
      .with('trainings')
      .with('followers')
      .with('following')
      .where('id', id)
      .first()

    return profile
  },
  async getUserProfile(slug) {
    const profile = await User
      .query()
      .with('trainings', (builder) => {
        builder.where('private', false)
      })
      .with('followers')
      .with('following')
      .where('slug', slug)
      .first()

    return profile
  },
  async getUserTrainings(slug) {
    const profile = await User
      .query()
      .with('trainings', (builder) => {
        builder.where('private', false)
      })
      .where('slug', slug)
      .fetch()

    return profile
  },
  async editProfile(id, data) {
    const updatedUser = await User
      .query()
      .where('id', id)
      .update({ name: data.name, description: data.description })

    return updatedUser
  },
  async changeAvatar(id, url) {
    const updatedUser = await User
      .query()
      .where('id', id)
      .update({ avatar: url })

    return updatedUser
  },
  async followUser(user, userToFollow) {
    await user.following().attach(userToFollow)

    return
  },
  async unfollowUser(user, userToFollow) {
    await user.following().detach(userToFollow)

    return
  }
}

module.exports = AccountQuery
