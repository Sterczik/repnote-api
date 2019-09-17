'use strict'

const HTTPStatus = require('http-status')
const User = use('App/Models/User')
const { validate } = use('Validator')
const CloudinaryService = use('App/Services/CloudinaryService');

class AccountController {
  async getProfile({ request, response, auth }) {
    try {
      const loggedUser = await auth.getUser()

      console.log("1")

      const user = await User
        .query()
        .with('trainings')
        .where('id', loggedUser.id)
        .first()

      return response.status(HTTPStatus.OK)
        .json(user)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!'
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
            message: validation.messages()
          }
        })
      }

      const profileData = request.only(['name', 'description'])

      const updatedUser = await User
        .query()
        .where('id', loggedUser.id)
        .update({ name: profileData.name, description: profileData.description })

      return response.status(HTTPStatus.OK)
        .json(updatedUser)

    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!'
      })
    }
  }

  async changeAvatar({ request, response, auth }) {
    try {
      const loggedUser = await auth.getUser()
      console.log(loggedUser.id)

      const photo = request.file('avatar')

      const cloudinaryResponse = await CloudinaryService.v2.uploader.upload(photo.tmpPath, { folder: 'repnote/avatars' });

      console.log(cloudinaryResponse.secure_url)

      const user = await User
        .query()
        .where('id', loggedUser.id)
        .update({ avatar: cloudinaryResponse.secure_url })

      return response.status(HTTPStatus.OK)
        .json({ success: true, avatar: user.avatar })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!',
        err
      })
    }
  }

  async getUserProfile({ request, response }) {
    try {
      const slug = request.params.name
      const user = await User
        .query()
        .with('trainings', (builder) => {
          builder.where('private', false)
        })
        .with('followers')
        .with('following')
        .where('slug', slug)
        .first()

      if (user) {
        return response.status(HTTPStatus.OK)
          .json(user)
      }
      return response.status(HTTPStatus.NOT_FOUND).json(HTTPStatus.NOT_FOUND)
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!'
      })
    }
  }

  async getUserTrainings({ request, response }) {
    try {
      const slug = request.params.name
      const user = await User
        .query()
        .with('trainings', (builder) => {
          builder.where('private', false)
        })
        .where('slug', slug)
        .fetch()

      return response.status(HTTPStatus.OK).json(user.toJSON())
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!'
      })
    }
  }
}

module.exports = AccountController
