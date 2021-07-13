'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LoanSchema extends Schema {
  up () {
    this.create('loans', (table) => {
      table.increments()
      table.integer('book_id').unsigned().references('id').inTable('books')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('quantity').default(0)
      table.string('limit_date')
      table.string('delivered_date')
      table.timestamps()
    })
  }

  down () {
    this.drop('loans')
  }
}

module.exports = LoanSchema
