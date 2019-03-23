'use strict'

const HTTPStatus = require('http-status')
const User = use('App/Models/User')
const Hash = use('Hash')
const Mail = use('Mail')
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
          })
      }

      const validation = await validate(request.only(['name', 'email', 'password', 'password_confirmation']), {
        email: 'required|email|unique:users',
        name: 'required|min:3|max:30|unique:users',
        password: 'required|confirmed|min:6|max:30'
      })
      //|regex:/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: validation.messages()
          }
        })
      }

      await User.create(data)

      // await Mail.send('emails.welcome', user.toJSON(), (message) => {
      //   message
      //     .from('hello@sterczik.io')
      //     .to(user.email)
      //     .subject('Hello ✔')
      // })

      return response.status(HTTPStatus.CREATED)
        .json({
          success: true,
          message: 'You successfully registered.'
        })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Problem occured while trying to signup. Please try again.'
      })
    }
  }

  async login({request, response, auth}) {
    try {
      const data = request.only(['email', 'password'])

      const validation = await validate(request.only(['email', 'password']), {
        email: 'required|email',
        password: 'required|min:6|max:30'
      })
      //|regex:/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: validation.messages()
          }
        })
      }

      const userExists = await User.findBy('email', data.email)

      if (!userExists) {
        return response.status(HTTPStatus.BAD_REQUEST)
          .json({
            success: false,
            errors: {
              message: 'There is no account with this email.'
            }
          })
      }

      const passwordCheck = await Hash.verify(data.password, userExists.password)

      if (!passwordCheck) {
        return response.status(HTTPStatus.BAD_REQUEST)
          .json({
            success: false,
            errors: {
              message: 'Invalid password'
            }
          })
      }

      const token = await auth
        .withRefreshToken()
        .attempt(data.email, data.password)

      return response.status(HTTPStatus.OK)
        .json({
          success: true,
          token
        })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Problem occured while trying to sigin. Please try again.'
      })
    }
  }
}

module.exports = UserController
