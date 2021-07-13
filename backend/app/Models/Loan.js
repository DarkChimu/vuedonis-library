'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Loan extends Model {
    book () {
        return this.belongsTo('App/Models/Book')
    }

    user () {
        return this.belongsTo('App/Models/User')
    }
}

module.exports = Loan
