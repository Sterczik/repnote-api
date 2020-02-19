'use strict'

const User = use('App/Models/User')

const AccountQuery = {
  async getProfile(id) {
    const profile = await User
      .query()
      .with('trainings', (builder) => {
        builder.with('user')
        builder.with('category')
        builder.with('advancementLevel')
        builder.with('subtrainings')
        builder.with('subtrainings.exercises')
        builder.with('subtrainings.exercises.category')
        builder.with('subtrainings.exercises.rounds')
        builder.with('likes')
        builder.withCount('likes')
        builder.orderBy('likes_count', 'desc')
      })
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
        builder.with('user')
        builder.with('category')
        builder.with('advancementLevel')
        builder.with('subtrainings')
        builder.with('subtrainings.exercises')
        builder.with('subtrainings.exercises.category')
        builder.with('subtrainings.exercises.rounds')
        builder.with('likes')
        builder.withCount('likes')
        builder.orderBy('likes_count', 'desc')
      })
      .with('followers')
      .with('following')
      .where('slug', slug)
      .first()

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
  async unfollowUser(user, userToUnfollow) {
    await user.following().detach(userToUnfollow)

    return
  }
}

module.exports = AccountQuery
