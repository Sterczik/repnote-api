'use strict'

const HTTPStatus = require('http-status')
const Admin = use('App/Models/Admin')
const Hash = use('Hash')
const Encryption = use('Encryption')
const { validate, rule } = use('Validator')
const AdminQuery = use('App/Queries/AdminQuery')
const TokenQuery = use('App/Queries/TokenQuery')

class AdminController {
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

      const adminExists = await Admin.findBy('email', data.email)
      if (!adminExists) {
        return accountError()
      }

      const passwordCheck = await Hash.verify(data.password, adminExists.password)
      if (!passwordCheck) {
        return accountError()
      }

      const token = await auth
        .authenticator('admin')
        .withRefreshToken()
        .attempt(data.email, data.password)

      return response.status(HTTPStatus.OK)
        .json({
          success: true,
          token
        })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        errors: {
          message: 'Something went wrong'
        }
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
        .authenticator('admin')
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

      const loggedAdmin = await auth.authenticator('admin').getUser()
      const user = await AdminQuery.getOne(loggedAdmin.id)

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

      await AdminQuery.changePassword(loggedAdmin.id, hashedPassword)

      return response.status(HTTPStatus.OK)
        .json({
          success: true
        })
    } catch(err) {
      return response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        errors: {
          message: 'Something went wrong'
        }
      })
    }
  }
}

module.exports = AdminController
