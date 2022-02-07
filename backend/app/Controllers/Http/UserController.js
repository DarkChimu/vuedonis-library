"use strict";

const User = use("App/Models/User");
const Loan = use("App/Models/Loan");
const Report = use("App/Models/Report");

class UserController {
  /**
   * @swagger
   * /api/users:
   *   get:
   *     tags:
   *       - Users
   *     summary: Obtener todos los usuarios
   *     responses:
   *       200:
   *         description: Lista de usuarios
   *         type: array
   *         example:
   *          id: 1
   *          username: "admin"
   *          first_name: "admin"
   *          last_name: "admin"
   *          email: "admin@test.com"
   *          ci: "12345678"
   *          address: "admin"
   *          role: "admin"
   *   $ref: '#/definitions/User'
   */
  async index({ request }) {
    const { ci } = request.all();

    const users = User.query().with('reports');

    if (ci) {
      users.where("ci", ci);
    }

    const results = await users.paginate();

    return results;
  }

  async update({ request, params }) {
    const { username, first_name, last_name, email, ci, address, photo_url } =
      request.all();
    const { id } = params;

    let user = await User.query().where("id", id).first();

    if (!user) {
      return { message: "user_not_found" };
    }

    try {
      await user.merge({
        username,
        first_name,
        last_name,
        email,
        ci,
        address,
        photo_url,
      });

      await user.save();
    } catch (error) {
      return { message: error.message };
    }

    return { success: true };
  }

  async login({ request, auth, response }) {
    const { email, password } = request.only(["email", "password"]);

    try {
      const token = await auth.attempt(email, password);

      return response.json({
        status: "success",
        data: token,
      });
    } catch (error) {
      response.status(400).json({
        status: "error",
        message: "Invalid email/password.",
      });
    }
  }

  async register({ request, auth, response }) {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      address,
      ci,
      rescue_word,
      person_type
    } = request.all();

    let role = person_type === 'Empresarial' ? 'enterprice' : null

    try {
      const user = await User.create({
        email,
        password,
        username,
        first_name,
        last_name,
        address,
        ci,
        rescue_word,
        role
      });

      const token = await auth.attempt(email, password);

      return response.json({
        status: "success",
        data: token,
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async resetPassword({ request }) {
    const { rescue_word, newPassword, ci } = request.all();

    let user = await User.query().where("ci", ci).first();

    if (!user) {
      return response.status(400).json({
        status: "error",
        message: "user_not_found",
      });
    }

    if (user.rescue_word !== rescue_word) {
      return response.status(400).json({
        status: "error",
        message: "rescue_word_not_match",
      });
    }

    user.merge({ password: newPassword });
    user.save();

    return { succcess: true };
  }

  async delete({ params }) {
    const { id } = params;
    const user = await User.query().where("id", id).first();

    await user.delete();

    return { success: true };
  }

  async me({ auth, response }) {
    return response.json({
      status: "success",
      data: auth.user,
    });
  }

  async myBooks({ params, request }) {
    const { id } = params;
    const { search, page, perPage } = request.all();

    const loans = await Loan.query()
      .where("user_id", id)
      .with("book", (qb2) => {
        qb2.select("id", "title", "author", "distribution_info", "theme_termn");
        if (search) {
          const keyword = `%${decodeURIComponent(
            search.trim().replace(" ", "").toLowerCase()
          )}%`;

          qb2.whereRaw("LOWER(CONCAT(title)) LIKE ?", keyword);
        }
      })
      .paginate(page, perPage);

    return loans;

    /* const user = await User.query()
            .select('id','username')
            .where('id', id)
            .with('loans', qb => {
                qb
                .with('book', qb2 => {
                    qb2.select('id','title', 'author', 'distribution_info', 'theme_termn')
                    if (search) {
                        const keyword = `%${decodeURIComponent(
                            search
                              .trim()
                              .replace(' ', '')
                              .toLowerCase()
                          )}%`
                          
                          qb2.whereRaw('LOWER(CONCAT(title)) LIKE ?', keyword)
                    }
                }).paginate(page, perPage)
            })
            .first()

        
        return user */
  }

  async grantAdmin({ request, params }) {
    const { id } = params;

    const user = await User.query().where("id", id).first();

    if (!user) {
      return { message: "user_not_found" };
    }

    await user.merge({
      role: "admin",
    });

    await user.save();

    return { success: true };
  }

  async createReport({ request, response }) {
    const { user_id, description } = request.all();

    try {
      const report = await Report.create({
        user_id,
        description,
      });

      return response.status(200).json({ success: true, report });
    } catch (error) {
      return response
        .status(400)
        .json({ success: false, message: error.message });
    }
  }

  async reports({ request, params }) {
    const { id } = params;
    const { page, perPage } = request.all();

    const reports = await Report.query()
      .where("user_id", id)
      .paginate(page, perPage);

    return reports;
  }
}

module.exports = UserController;
