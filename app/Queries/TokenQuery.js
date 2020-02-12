'use strict'

const Token = use('App/Models/Token')

const TokenQuery = {
  async getAll() {
    const tokens = await Token
      .all()

    return tokens
  },
  async getOne(id) {
    const token = await Token
      .query()
      .where('id', id)
      .first()

    return token
  },
  async getDecryptedOne(token) {
    const token = await Token
      .query()
      .where('token', token)
      .first()

    return token
  },
  async remove(token) {
    await token.delete()
  }
}

module.exports = TokenQuery
