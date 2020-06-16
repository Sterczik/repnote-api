'use strict'

const Env = use('Env')
const HTTPStatus = require('http-status')
const User = use('App/Models/User')
const Hash = use('Hash')
const Encryption = use('Encryption')
const { validate, rule } = use('Validator')
const UserQuery = use('App/Queries/UserQuery')
const TokenQuery = use('App/Queries/TokenQuery')

class UserController {
  async socialLoginCallback ({ request, params, ally, auth, response }) {
    try {
      const provider = params.provider
      const bodyResponse = request.raw()
      const token = JSON.parse(bodyResponse)
      const accessToken = token.response

      const userData = await ally.driver(params.provider).getUserByToken(accessToken)

      const authUser = await User
        .query()
        .where({
          'provider': provider,
          'provider_id': userData.getId()
        })
        .first()

      if (!(authUser === null)) {
        const userToken = await auth.withRefreshToken().generate(authUser)
        return response.status(HTTPStatus.OK)
          .json({
            success: true,
            token: { ...userToken }
          })
      }

      const user = new User()
      user.name = userData.getName()
      user.username = userData.getNickname()
      user.email = userData.getEmail()
      user.provider_id = userData.getId()
      user.avatar = userData.getAvatar()
      user.provider = provider

      await user.save()

      const userToken = await auth.withRefreshToken().generate(user)

      return response.status(HTTPStatus.CREATED)
        .json({
          success: true,
          token: { ...userToken }
        })
    } catch (e) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR)
        .json({
          error: JSON.stringify(e)
        })
    }
  }

  async register({ request, response }) {
    try {
      const inputData = request.only(['name', 'email', 'password'])
      const userExists = await User.findBy('email', inputData.email)
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
        password: [
          rule('required'),
          rule('confirmed'),
          rule('min', 6),
          rule('max', 30),
          rule(
            'regex',
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/
          )
        ]
      })

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: 'Validation error.'
          }
        })
      }

      const data = {
        ...inputData,
        avatar: Env.get('DEFAULT_AVATAR', 'empty'),
        provider_id: '1',
        provider: 'at'
      }

      await User.create(data)

      return response.status(HTTPStatus.CREATED)
        .json({
          success: true,
          message: 'You successfully registered.'
        })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong',
        err
      })
    }
  }

  async login({ request, response, auth }) {
    try {
      const data = request.only(['email', 'password'])

      const validation = await validate(request.only(['email', 'password']), {
        email: 'required|email',
        password: 'required|min:6|max:30'
      })

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: 'Validation error.'
          }
        })
      }

      const accountError = () => {
        return response.status(HTTPStatus.BAD_REQUEST)
          .json({
            success: false,
            errors: {
              message: 'Invalid password or account does not exist'
            }
          })
      }

      const userExists = await User.findBy('email', data.email)
      if (!userExists) {
        return accountError()
      }

      const passwordCheck = await Hash.verify(data.password, userExists.password)
      if (!passwordCheck) {
        return accountError()
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
        message: 'Something went wrong'
      })
    }
  }

  async changePassword({ request, response, auth }) {
    try {
      const data = request.only(['oldPassword', 'password'])

      const validation = await validate(request.only(['oldPassword', 'password', 'password_confirmation']), {
        oldPassword: 'required|min:6|max:30',
        password: [
          rule('required'),
          rule('confirmed'),
          rule('min', 6),
          rule('max', 30),
          rule(
            'regex',
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/
          )
        ]
      })

      if (validation.fails()) {
        return response.status(HTTPStatus.BAD_REQUEST).json({
          success: false,
          errors: {
            message: 'Validation error.'
          }
        })
      }

      const newPasswordCheck = data.oldPassword === data.password
      if (newPasswordCheck) {
        return response.status(HTTPStatus.BAD_REQUEST)
          .json({
            success: false,
            errors: {
              message: 'New password matches old password.'
            }
          })
      }

      const loggedUser = await auth.getUser()
      const user = await UserQuery.getOne(loggedUser.id)

      const oldPasswordCheck = await Hash.verify(data.oldPassword, user.password)
      if (!oldPasswordCheck) {
        return response.status(HTTPStatus.BAD_REQUEST)
          .json({
            success: false,
            errors: {
              message: 'You passed wrong old password.'
            }
          })
      }

      const hashedPassword = await Hash.make(data.password)

      await UserQuery.changePassword(loggedUser.id, hashedPassword)

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

  async logout({ request, response }) {
    try {
      const { token } = request.only(['token'])
      const decryptedToken = Encryption.decrypt(token)

      const tokenToRemove = await TokenQuery.getDecryptedOne(decryptedToken)
      await TokenQuery.remove(tokenToRemove)

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

  async refreshToken({ request, response, auth }) {
    try {
      const { refreshToken } = request.only(['refreshToken'])

      const refreshedToken = await auth
        .generateForRefreshToken(refreshToken)

      return response.status(HTTPStatus.OK)
        .json({
          success: true,
          token: refreshedToken
        })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong'
      })
    }
  }
}

module.exports = UserController
