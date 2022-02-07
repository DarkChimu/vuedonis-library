"use strict";

const Loan = use("App/Models/Loan");
const Book = use("App/Models/Book");

class LoanController {
  async index({ request }) {
    const { ci } = request.all();

    let loans = Loan.query().with("user").with("book");

    if (ci) {
      loan.whereHas("user", (builder) => {
        builder.where("ci", ci);
      });
    }

    const results = await loans.paginate();

    return results;
  }
  async store({ request }) {
    const { user_id, book_id } = request.all();

    const findLoan = await Loan.query()
      .where("user_id", user_id)
      .where("book_id", book_id)
      .first();

    if (findLoan) {
      return { success: false, message: "loan_already_exists" };
    }

    try {
      let loan = await Loan.create({
        user_id,
        book_id,
      });

      return { success: true, loan };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async update({ request, params, response }) {
    const { limit, delivered, book_id } = request.all();
    const { id } = params;

    let loan = await Loan.query().where("id", id).first();

    try {
      await loan.merge({
        limit,
        delivered
      });

      if (delivered) {
        let book = await Book.query().where("id", book_id).first();

        await book.merge({
          quantity: book.quantity + 1,
        });

        await book.save();
      }

      await loan.save();
      
      return { success: true };
    } catch (error) {
      return response
        .status(500)
        .json({ success: false, message: error.message });
    }
  }

  async delete({ request, params }) {
    const { id } = params;

    let loan = await Loan.query()
      .where("id", id)
      .with("book")
      .with("user")
      .first();

    if (!loan) {
      return { message: "loan_not_found" };
    }

    let loanBookId = (await loan.toJSON().book.id) || null;

    if (!loanBookId) {
      await loan.delete();
      return { success: true, error: "book_not_found" };
    }

    let book = await Book.query().where("id", loanBookId).first();

    try {
      await book.merge({ quantity: book.quantity + 1 });
      await book.save();

      await loan.delete();
    } catch (error) {
      console.log(error);
    }

    return { success: true };
  }
}

module.exports = LoanController;
