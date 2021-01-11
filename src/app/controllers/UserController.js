const User = require("../models/User")

module.exports = {
    registerForm(req, res) {
        return res.render('user/register')
    },
    async post(req, res) {
        try {
            const userId = await User.create(req.body)

            return res.redirect('/admin/users/register')
        } catch (err) {
            console.error(err)
        }
    }
}