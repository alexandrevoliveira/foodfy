const User = require("../models/User")

const { compare } = require('bcryptjs')

module.exports = {
    async index(req, res) {
        const id = req.session.userId

        const user = await User.findOne({ where: { id }})

        return res.render("user/edit", { user })
    },
    async put(req, res) {
        try {
            const { user } = req
            const { name, email, password } = req.body

            const passed = await compare(password, user.password)

            if(!passed) return res.render("user/edit", {
                user: req.body,
                error: "Senha inválida, digite novamente"
            })

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