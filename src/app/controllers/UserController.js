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
    async post(req, res) {
        try {
            const userId = await User.create(req.body)

            req.session.userId = userId

            return res.redirect('/admin/users/register')
        } catch (err) {
            console.error(err)
        }
    }
}