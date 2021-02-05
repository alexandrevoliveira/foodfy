const User = require("../models/User")

const crypto = require('crypto')
const mailer = require("../lib/mailer")
const { hash } = require("bcryptjs")

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
    },
    forgotForm(req, res) {
        return res.render("session/forgot-password")
    },
    resetForm(req, res) {
        return res.render("session/password-reset", { token: req.query.token })
    },
    async forgot(req, res) {
        try {
            const { user } = req

            // create a token
            const token = crypto.randomBytes(20).toString("hex")
       
            // set an expiration hour
            let now = new Date()
            now = now.setHours(now.getHours() + 1)
    
            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })
            
            await mailer.sendMail({
                to: user.email,
                from: "no-reply@foodfy.com.br",
                subject: "Recuperação de senha",
                html: `<h2>Perdeu a chave?</h2>
                <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:3000/admin/users/password-reset?token=${token}" target="_blank">
                        RECUPERAR SENHA
                    </a>
                </p>
                `
            })
    
            return res.render("session/forgot-password", {
                success: "Verifique seu email para resetar sua senha"
            })
        } catch (err) {
            console.error(err)
            return res.render("session/forgot-password", {
                user: req.body,
                error: "Erro inesperado, tente novamente"
            })
        }

    },
    async reset(req, res) {
        const { user } = req
        const { password, token } = req.body

        try {
            // creates a new password hash
            const newPassword = await hash(password, 8)

            // update user
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            // warn user he has a new password
            return res.render("session/login", {
                user: req.body,
                success: "Senha atualizada! Faça o seu login."
            })

        } catch (err) {
            console.error(err)
            return res.render("session/password-reset", {
                user: req.body,
                token,
                error: "Erro inesperado, tente novamente"
            })
        }
    }
}