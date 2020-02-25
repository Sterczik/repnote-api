'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Authenticator
  |--------------------------------------------------------------------------
  |
  | Authentication is a combination of serializer and scheme with extra
  | config to define on how to authenticate a user.
  |
  | Available Schemes - basic, session, jwt, api
  | Available Serializers - lucid, database
  |
  */
  authenticator: 'user',

  /*
  |--------------------------------------------------------------------------
  | Jwt for users
  |--------------------------------------------------------------------------
  |
  | The jwt authenticator works by passing a jwt token on each HTTP request
  | via HTTP `Authorization` header.
  |
  */
  user: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'jwt',
    uid: 'email',
    password: 'password',
    options: {
      secret: `${Env.get('APP_KEY')}-user`,
      expiresIn: '36000000'
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Jwt for admins
  |--------------------------------------------------------------------------
  |
  | The jwt authenticator works by passing a jwt token on each HTTP request
  | via HTTP `Authorization` header.
  |
  */
  admin: {
    serializer: 'lucid',
    model: 'App/Models/Admin',
    scheme: 'jwt',
    uid: 'email',
    password: 'password',
    options: {
      secret: `${Env.get('APP_KEY')}-admin`,
      expiresIn: '36000000'
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Api
  |--------------------------------------------------------------------------
  |
  | The Api scheme makes use of API personal tokens to authenticate a user.
  |
  */
  api: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'api',
    uid: 'email',
    password: 'password'
  }
}
