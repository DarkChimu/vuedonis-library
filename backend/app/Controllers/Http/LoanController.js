'use strict'

const Loan = use('App/Models/Loan')
const Book = use('App/Models/Book')

class LoanController {
    async index({ request }) {
        const { ci } = request.all()

        let loans = Loan.query()
            .with('user')
            .with('book')

        if (ci) {
            loan.whereHas('user', builder => {
                builder.where('ci', ci)
            })
        }

        const results = await loans.paginate()

        return results
    }
    async store({ request }) {
        const { user_id, book_id } = request.all()

        let book = await Book.query().where('id', book_id).first()

        let loanExist = await Loan.query()
            .with('book', qb => {
                qb.where('id', book_id)
            })
            .first()

        if (loanExist) {
            try {
                loanExist.merge({ quantity: loanExist.quantity + 1 })
                loanExist.save()
                book.merge({ quantity: book.quantity - 1 })
                book.save()
                return { success: true, loan: loanExist }
            } catch (error) {
                return { success: false, error: error.message }
            }
        }

        try {
            const loan = await Loan.create({
                user_id,
                book_id
            })

            return { success: true, loan }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    async update({ request, params }) {
        const { max_date, delivered } = request.all()
        const { id } = params

        let loan = await Loan.query().where('id', id).first()

        try {
            await loan.merge({
                limit: max_date,
                delivered: delivered
            })

            loan = loan.toJSON()

            if (delivered) {
                let book = await Book.query().where('id', loan.book_id).first()

                await book.merge({
                    quantity: book.quantity + 1
                })

                await book.save()
            }

            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    async delete({ params }) {
        const { id } = params

        let loan = await Loan.query()
            .where('id', id)
            .with('book')
            .first()

        if (!loan) {
            return { message: 'loan_not_found' }
        }

        let loanBookId = await loan.toJSON().book.id

        let book = await Book.query().where('id', loanBookId).first()

        try {

            

            if(loan.quantity > 1) {
                await loan.merge({ quantity: loan.quantity -1 })
                await book.merge({ quantity: book.quantity + 1 })
                await book.save()
                await loan.save()

                return { success: true }
            }else{
                await loan.delete()
                await book.merge({ quantity: book.quantity + 1 })
                await book.save()

                return { success: true }
            }
        } catch (error) {
            console.log(error.message)
            return { success: false, error: error.message }
        }
    }
}

module.exports = LoanController
