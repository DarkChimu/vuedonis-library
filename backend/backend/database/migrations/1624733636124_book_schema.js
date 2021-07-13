'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookSchema extends Schema {
  up () {
    this.create('books', (table) => {
      table.increments()
      table.jsonb('ISBN')
      table.jsonb('decimal_dewey_number')
      table.jsonb('author')
      table.jsonb('corporative_name')
      table.jsonb('principal_entry')
      table.jsonb('title')
      table.jsonb('parallel_title')
      table.jsonb('edition_mention')
      table.jsonb('distribution_info')
      table.jsonb('physical_desc')
      table.jsonb('serie_mention')
      table.jsonb('content_note')
      table.jsonb('theme_termn')
      table.integer('quantity')
      table.string('photo_url')
      table.timestamps()
    })
  }

  down () {
    this.drop('books')
  }
}

module.exports = BookSchema
