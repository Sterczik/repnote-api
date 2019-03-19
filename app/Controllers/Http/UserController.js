'use strict'

const HTTPStatus = require('http-status')
const User = use('App/Models/User')
const { validate } = use('Validator')

class UserController {
  async signUp({ request, response, auth }) {
    try {
      const data = request.only(['name', 'email', 'password'])
      const userExists = await User.findBy('email', data.email)

      if (userExists) {
        return response.status(HTTPStatus.BAD_REQUEST)
          .json({
            success: false,
            errors: {
              type: 'email',
              message: 'This email already exists'
            }
          });
      }

      //! Get registerValidationSchema from express

      const validation = await validate(request.only(['name', 'email', 'password', 'password_confirmation']), {
        email: 'required|email|unique:users',
        name: 'required|min:3|max:30',
        password: 'required|confirmed|min:6|max:30'
      })
      //|regex:/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: validation.messages()
          }
        });
      }

      const user = await User.create(data)
      await user.save()

      return response.status(HTTPStatus.CREATED)
        .json({
          success: true,
          message: 'You successfully registered.'
        })
    } catch(err) {
      return response.status(500).json({
        status: 'error',
        message: 'Problem occured while trying to signup. Please try again.'
      })
    }
  }

  async login({request, response, auth}) {
    try {
      const data = request.only(['email', 'password'])

      if (!data) {
        return response.status(404).json({ data: 'Resource not found' })
      }

      const token = await auth
        .withRefreshToken()
        .attempt(data.email, data.password)

      return response.json({
        token
      })
    } catch(err) {
      return response.status(400).json({
        status: 'error',
        message: 'Problem occured while trying to sigin. Please try again.'
      })
    }
  }
}

module.exports = UserController
