'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Book extends Model {
    loan () {
        this.hasMany('App/Models/Loan')
    }
}

module.exports = Book
