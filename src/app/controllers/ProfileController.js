const User = require("../models/User")

module.exports = {
    async index(req, res) {
        const id = req.session.userId

        const user = await User.findOne({ where: { id }})

        return res.render("user/edit", { user })
    },
    async put(req, res) {
        try {
            const { user } = req
            let { name, email } = req.body

            await User.update(user.id, {
                name,
                email
            })

            return res.redirect("/admin/profile")
        } catch (err) {
            console.error(err)
        }
    }
}