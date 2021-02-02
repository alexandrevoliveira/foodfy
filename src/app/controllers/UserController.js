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
        try {
            let id = req.session.userId
            let user
            let admin
    
            user = await User.findOne({ where: { id }})
                
            // verifico primeiramente se o usuário que está logado é admin, 
            // caso seja colocarei na variável admin, caso contrário o retornarei para
            // seu Profile, pois este não deveria estar acessando o profile de outros usuários
            if(user.is_admin) {
                admin = user
            } else{
                return res.redirect("/admin/profile")
            }
            // a finalidade de obter os dados do admin é para adicionar as restrições 
            // de usuário comum à algumas funcionalidades


            // pega o id no parametro e depois procura pelo usuario
            id = req.params.id
            user = await User.findOne({ where: { id }})

            return res.render("user/edit", { admin, user })

        } catch (err) {
            console.error(err)
        }
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