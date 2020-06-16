'use strict'

const Env = use('Env')
const Database = use('Database')
const HTTPStatus = require('http-status')
const { validate } = use('Validator')
const AccountQuery = use('App/Queries/AccountQuery')
const CloudinaryService = use('App/Services/CloudinaryService')

class AccountController {
  async getProfile({ request, response, auth }) {
    try {
      const loggedUser = await auth.getUser()
      const profile = await AccountQuery.getProfile(loggedUser.id)

      return response.status(HTTPStatus.OK)
        .json(profile)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong'
      })
    }
  }

  async editProfile({ request, response, auth }) {
    try {
      const loggedUser = await auth.getUser()
      const validation = await validate(request.only(['name']), {
        name: 'required|min:5|max:60'
      })

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: 'Validation error.'
          }
        })
      }

      const profileData = request.only(['name', 'description'])

      await AccountQuery.editProfile(loggedUser.id, profileData)
      const updatedUser = await AccountQuery.getProfile(loggedUser.id)

      return response.status(HTTPStatus.OK)
        .json(updatedUser)

    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong'
      })
    }
  }

  async changeAvatar({ request, response, auth }) {
    try {
      const loggedUser = await auth.getUser()
      const photo = request.file('avatar')

      const cloudinaryResponse = await CloudinaryService.v2.uploader.upload(photo.tmpPath, { folder: 'repnote/avatars' });

      await AccountQuery.changeAvatar(loggedUser.id, cloudinaryResponse.secure_url)
      const user = await AccountQuery.getProfile(loggedUser.id)

      return response.status(HTTPStatus.OK)
        .json({ success: true, avatar: user.avatar })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async resetAvatar({ request, response, auth }) {
    try {
      const loggedUser = await auth.getUser()
      await AccountQuery.changeAvatar(loggedUser.id, Env.get('DEFAULT_AVATAR', 'empty'))
      const user = await AccountQuery.getProfile(loggedUser.id)

      return response.status(HTTPStatus.OK)
        .json({ success: true, avatar: user.avatar })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async getUserProfile({ request, response, auth }) {
    try {
      const user = await AccountQuery.getUserProfile(request.params.name)

      let loggedUser = null
      let follow = null
      try {
        if (await auth.getUser()) {
          loggedUser = await auth.getUser()

          follow = await Database
            .from('followers')
            .where('user_id', user.id)
            .where('follower_id', loggedUser.id)
            .first()
        } else {
        }
      } catch(e) {}

      if (user) {
        user.followed = Boolean(follow)
        return response.status(HTTPStatus.OK)
          .json(user)
      }
      return response.status(HTTPStatus.NOT_FOUND).json(HTTPStatus.NOT_FOUND)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong'
      })
    }
  }

  async follow({ request, response, auth }) {
    try {
      const loggedUser = await auth.getUser()
      await AccountQuery.followUser(loggedUser, request.params.id)

      return response.status(HTTPStatus.OK)
        .json({
          success: true
        })

    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong'
      })
    }
  }

  async unfollow({ request, response, auth }) {
    try {
      const loggedUser = await auth.getUser()
      await AccountQuery.unfollowUser(loggedUser, request.params.id)

      return response.status(HTTPStatus.OK)
        .json({
          success: true
        })

    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong'
      })
    }
  }
}

module.exports = AccountController
