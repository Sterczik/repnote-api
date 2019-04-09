'use strict'

const HTTPStatus = require('http-status')
const User = use('App/Models/User')
const Hash = use('Hash')
const Mail = use('Mail')
const { validate } = use('Validator')

class UserController {
  async register({ request, response, auth }) {
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

  async signup({request, response, auth}) {

    const validation = await validate(request.all(), {
      email: 'required|email:unique:users',
      name: 'required|unique:users',
      password: 'required'
    })

    if (validation.fails()) {
      return response.send(validation.messages())
    }

    const user = new User()
    user.email = request.input('email')
    user.name = request.input('name')
    user.password = request.input('password')

    await user.save()

    const token = await auth.generate(user)

    return response.json({
      message: 'Successfully',
      data: token
    })
  }

  async signin({request, response, auth}) {
    try {
      const parameter = request.only(['email', 'password'])

      if (!parameter) {
          return response.status(404).json({data: 'Resource not found'})
      }

      const token = await auth.attempt(parameter.email, parameter.password)

      return response.json({
          token: token
      })
    } catch(err) {
      return response.status(400).json({})
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
          token,
          user: {
            id: userExists.id
          }
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
