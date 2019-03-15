'use strict'

const User = use('App/Models/User')

class AuthController {

  async handleProviderCallback ({request, params, ally, auth, response}) {
    try {
      const provider = params.provider
      const bodyResponse = request.raw()
      const token = JSON.parse(bodyResponse)
      const accessToken = token.response

      const userData = await ally.driver(params.provider).getUserByToken(accessToken)

      const authUser = await User.query().where({
        'provider': provider,
        'provider_id': userData.getId()
      }).first()
      if (!(authUser === null)) {
        const userToken = await auth.generate(authUser)
        return response.status(200)
          .json({
            googleUserToken: userData.getAccessToken(),
            user: {
              id: authUser.id,
              token: userToken
            },
            success: true
          });
      }

      const user = new User()
      user.name = userData.getName()
      user.username = userData.getNickname()
      user.email = userData.getEmail()
      user.provider_id = userData.getId()
      user.avatar = userData.getAvatar()
      user.provider = provider

      await user.save()

      const userToken = await auth.generate(authUser)

      return response.status(200)
        .json({
          googleUserToken: userData.getAccessToken(),
          user: {
            id: user.id,
            token: userToken
          },
          success: true
        });
    } catch (e) {
      return response.status(500)
        .json({
          error: JSON.stringify(e)
        })
    }
  }

}
module.exports = AuthController
