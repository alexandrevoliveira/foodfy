const User = require("../models/User")
const Recipe = require("../models/Recipe")
const File = require("../models/File")
const fs = require("fs")

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
            let id = req.session.userId,
            user,
            admin
    
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
            await User.create(req.body)
            const users = await User.all()

            return res.render('user/index', {
                users,
                success: "Conta criada com sucesso"
            })
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
    },
    async delete(req, res) {
        try {
            let id = req.session.userId,
            isAdmin
            user = await User.findOne({ where: { id } })
            if(user.is_admin == true) isAdmin = user

            if(!isAdmin) return res.render("user/edit", {
                user,
                error: "Ação não permitida"
            })

            id = req.body.id
            user = await User.findOne({ where: { id } })

            const users = await User.all()

            if(user && (user.id != isAdmin.id)){
                
                let results
                const recipes = await Recipe.allFromUsers(user.id)
                
                if(!recipes) {
                    await User.delete(user.id)
                    return res.redirect("/admin/users")                
                }
                
                // taking all recipe_files rows using recipe.id as param
                const recipe_filesPromise = recipes.map(recipe => File.findFiles(recipe.id))
                const recipe_filesResults = await Promise.all(recipe_filesPromise)
                const recipe_files = recipe_filesResults.map(recipefiles => recipefiles.rows[0])

                // first map will take recipe_files rows and return only the file_id | second map will take a promise array to get files
                results = recipe_files.map(field => field.file_id).map(id => File.takeFiles(id))
                
                const filesResults = await Promise.all(results)
                const files = filesResults.map(file => file.rows[0])
                
                files.map(async file => await File.delete(file.id))
                await User.delete(user.id)
             
                return res.redirect("/admin/users")
            } else {
                return res.render("user/index", {
                    users,
                    error: "Ação não permitida"
                })
            }

        } catch (err) {
            console.error(err)
            return res.render("recipes/index", {
                error: "Algum erro aconteceu. Tente novamente."
            })
        }
    }
}