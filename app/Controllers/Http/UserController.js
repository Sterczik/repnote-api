'use strict'
const User = use('App/Models/User')
const { validate } = use('Validator')

class UserController {
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
      return response.status(400).json({
        status: 'error',
        message: 'Problem occured while trying to sigin. Please try again.'
      })
    }
  }
}

module.exports = UserController
