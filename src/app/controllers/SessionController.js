module.exports = {
    loginForm(req, res) {
        return res.render("session/login")
    },
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect('/admin/users')
    },
    logout(req, res) {
        try {
            req.session.destroy()
            return res.redirect('/admin/users/login')
        } catch (err) {
            console.error(err)
        }
    }
}