'use strict'

/*
|--------------------------------------------------------------------------
| AdminSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Env = use('Env')
const Admin = use('App/Models/Admin')
const Database = use('Database')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class AdminSeeder {
  async run () {
    await Admin.create({
      email: Env.get('DEFAULT_ADMIN_EMAIL'),
      password: Env.get('DEFAULT_ADMIN_PASSWORD'),
      name: Env.get('DEFAULT_ADMIN_NAME')
    })

    Database.close()
  }
}

module.exports = AdminSeeder
