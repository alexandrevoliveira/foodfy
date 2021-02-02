module.exports = {
    loginForm(req, res) {
        return res.render("session/login")
    },
    login(req, res) {
        const { user } = req
        req.session.userId = user.id

        return res.redirect('/admin/profile')
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