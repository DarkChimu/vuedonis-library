'use strict'

const Book = use('App/Models/Book')

class BookController {

    async index({ request }) {

        let {
            title,
            page = 1,
            search = '',
            rowsPerPage = 12,
            sortDirection = 'asc',
            sortBy = 'created_at' 
        } = request.all()

        let books = Book.query()

        if (title) {
            title = title.toLowerCase().trim()
            books.where('title', title)
        }

        if (search) {
            const keyword = `%${decodeURIComponent(
                search
                  .trim()
                  .replace(' ', '')
                  .toLowerCase()
              )}%`
            
              books.whereRaw('LOWER(CONCAT(title)) LIKE ?', keyword)
        }

        const results = await books.paginate(page, rowsPerPage)

        return results
    }
    async store({ request }) {
        let {
            ISBN,
            decimal_dewey_number,
            author,
            corporative_name,
            principal_entry,
            title,
            parallel_title,
            edition_mention,
            distribution_info,
            physical_desc,
            serie_mention,
            content_note,
            theme_termn,
            quantity
        } = request.all()


        const book = await Book.create({
            ISBN,
            decimal_dewey_number,
            author,
            corporative_name,
            principal_entry,
            title,
            parallel_title,
            edition_mention,
            distribution_info,
            physical_desc,
            serie_mention,
            content_note,
            theme_termn,
            quantity
        })

        return { sucess: true, book }
    }

    async update({ request, params }) {
        const {
            ISBN,
            decimal_dewey_number,
            author,
            corporative_name,
            principal_entry,
            title,
            parallel_title,
            edition_mention,
            distribution_info,
            physical_desc,
            serie_mention,
            content_note,
            theme_termn,
            quantity,
            photo_url
        } = request.all()
        const { id } = params

        let book = await Book.query().where('id', id).first()

        if (!book) {
            return { message: 'book_not_found' }
        }

        try {
            await book.merge({
                ISBN,
                decimal_dewey_number,
                author,
                corporative_name,
                principal_entry,
                title,
                parallel_title,
                edition_mention,
                distribution_info,
                physical_desc,
                serie_mention,
                content_note,
                theme_termn,
                quantity,
                photo_url
            })

            await book.save()
        } catch (error) {
            console.log(error)
        }

        return { success: true }
    }

    async show({ params }) {
        const { id } = params

        const book = await Book.query().where('id', id)

        return book
    }

    async delete({ params }) {

        const { id } = params
        const book = await Book.query().where('id', id).first()

        await book.delete()

        return { success: true }
    }
}

module.exports = BookController
