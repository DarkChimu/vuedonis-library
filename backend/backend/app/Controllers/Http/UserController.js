'use strict'

const User = use('App/Models/User')

class UserController {
    async index({ request }) {
        const { ci } = request.all()

        const users = User.query()

        if (ci) {
            users.where('ci', ci)
        }

        const results = await users.paginate()

        return results
    }

    async update({ request, params }) {
        const { username, first_name, last_name, email, ci, address } = request.all()
        const { id } = params

        let user = await User.query().where('id', id).first()

        if (!user) {
            return { message: 'user_not_found' }
        }

        try {
            await user.merge({
                username,
                first_name,
                last_name,
                email,
                ci,
                address
            })

            await user.save()
        } catch (error) {
            console.log(error)
        }

        return { success: true }
    }

    async login({ request, auth, response }) {
        const { email, password } = request.only(['email', 'password'])

        try {
            const token = await auth.attempt(email, password)

            return response.json({
                status: 'success',
                data: token
            })
        } catch (error) {
            response.status(400).json({
                status: 'error',
                message: 'Invalid email/password.'
            })
        }
    }

    async register({ request, auth, response }) {
        const { username,
            email,
            password,
            first_name,
            last_name,
            address,
            ci,
            role
        } = request.all()

        try {
            const user = await User.create({
                email,
                password,
                username,
                first_name,
                last_name,
                address,
                ci,
                role
            })

            const token = await auth.attempt(email, password)

            return response.json({
                status: 'success',
                data: token
            })

        } catch (error) {
            console.log(error)
            return response.status(400).json({
                status: 'error',
                message: error.message
            })
        }
    }

    async resetPassword({ request }) {
        const { newPassword, email } = request.all()

        let user = await User.find(email)

        if (!user) {
            return { message: 'user_not_found' }
        }

        user.merge({ password: newPassword })
        user.save()

        return { succcess: true }
    }

    async delete({ params }) {

        const { id } = params
        const user = await User.query().where('id', id).first()

        await user.delete()

        return { success: true }
    }

    async me({ auth, response }) {
        return response.json({
            status: 'success',
            data: auth.user
        })
    }

    async myBooks({ params, request }) {
        const { id } = params
        const { search } = request.all()

        const user = await User.query()
            .select('id','username')
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
                })
            })
            .where('id', id)
            .first()

        
        return user
    }
}

module.exports = UserController
