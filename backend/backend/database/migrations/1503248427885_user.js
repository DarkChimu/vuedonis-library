'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('email', 254).notNullable().unique()
      table.string('username', 80).notNullable()
      table.string('password', 60).notNullable()
      table.string('first_name')
      table.string('last_name')
      table.string('ci', 8)
      table.string('address')
      table.string('photo_url')
      table.string('role').default('user')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
