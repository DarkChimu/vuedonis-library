'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportSchema extends Schema {
  up () {
    this.create('reports', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('description')
      table.timestamps()
    })
  }

  down () {
    this.drop('reports')
  }
}

module.exports = ReportSchema
