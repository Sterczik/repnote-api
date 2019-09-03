'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContactSchema extends Schema {
  up () {
    this.create('contacts', (table) => {
      table.increments()
      table.string('name', 50).notNullable()
      table.string('email', 50).notNullable()
      table.text('message').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('contacts')
  }
}

module.exports = ContactSchema
