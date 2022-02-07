'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChangePhotoUrlTypeFromUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.text('photo_url').alter()
    })
  }

  down () {
    this.table('users', (table) => {
      table.string('photo_url').alter()
    })
  }
}

module.exports = ChangePhotoUrlTypeFromUsersSchema
