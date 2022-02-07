'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddRescueWordToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('rescue_word', 60)
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('rescue_word')
    })
  }
}

module.exports = AddRescueWordToUsersSchema
