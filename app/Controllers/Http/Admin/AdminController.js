'use strict'

const HTTPStatus = require('http-status')
const Admin = use('App/Models/Admin')
const Hash = use('Hash')
const Encryption = use('Encryption')
const { validate } = use('Validator')
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
            message: validation.messages()
          }
        })
      }

      const userExists = await Admin.findBy('email', data.email)

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
        status: 'error',
        message: 'Problem occured while trying to sigin. Please try again.'
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
        message: 'Problem occured while trying to signout. Please try again.'
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
        message: 'Problem occured. Please try again.',
        err
      })
    }
  }
}

module.exports = AdminController
