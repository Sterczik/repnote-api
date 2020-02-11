'use strict'

const Contact = use('App/Models/Contact')

const ContactQuery = {
  async getAll() {
    const contactMessages = await Contact
      .all()

    return contactMessages
  },
  async getOne(id) {
    const contactMessage = await Contact
      .query()
      .where('id', id)
      .first()

    return contactMessage
  },
  async create(data) {
    const contactMessage = await Contact
      .create(data)

    return contactMessage
  },
  async remove(contactMessage) {
    await contactMessage.delete()
  }
}

module.exports = ContactQuery
