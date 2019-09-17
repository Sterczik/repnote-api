'use strict'

const Contact = use('App/Models/Contact')

const ContactQuery = {
  async getAll() {
    const contactMessages = await Contact
      .all()

    return contactMessages
  },
  async create(data) {
    const contactMessage = await Contact
      .create(data)

    return contactMessage
  }
}

module.exports = ContactQuery
