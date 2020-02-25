'use strict'

const Token = use('App/Models/Token')

const TokenQuery = {
  async getAll() {
    const tokens = await Token
      .query()
      .with('user')
      .fetch()

    return tokens
  },
  async getOne(id) {
    const token = await Token
      .query()
      .where('id', id)
      .first()

    return token
  },
  async getDecryptedOne(decryptedToken) {
    const token = await Token
      .query()
      .where('token', decryptedToken)
      .first()

    return token
  },
  async remove(token) {
    await token.delete()
  }
}

module.exports = TokenQuery
