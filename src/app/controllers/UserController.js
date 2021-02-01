const { put } = require("../../routes/users")
const User = require("../models/User")

module.exports = {
    registerForm(req, res) {
        return res.render('user/register')
    },
    async list(req, res) {
        // get all users
        const users = await User.all()
        return res.render("user/index", { users })
    },
    async show(req, res) {
        const id = req.params.id

        const user = await User.findOne({ where: { id }})

        return res.render("user/edit", { user })
    },
    async post(req, res) {
        try {
            const userId = await User.create(req.body)

            req.session.userId = userId

            return res.redirect('/admin/users')
        } catch (err) {
            console.error(err)
        }
    },
    async put(req, res) {
        try {
            const { user } = req
            let { name, email, is_admin } = req.body

            if(!is_admin) is_admin = false

            await User.update(user.id, {
                name,
                email,
                is_admin
            })

            return res.redirect("/admin/users")
        } catch (err) {
            console.error(err)
        }
    }
}