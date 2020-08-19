const Chef = require('../models/Chef')
const File = require('../models/File')


module.exports = {
    async index(req, res) {

        const results = await Chef.all()
        const chefs = results.rows

        return res.render("chefs/index", { chefs })
        
    },
    async show(req, res) {
        const chefId = req.params.id

        // find chef
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        // show chef's recipes
        results = await Chef.showAllRecipes(req.params.id)
        let recipes = results.rows

        // finding chefs' image
        results = await Chef.file(chef.file_id)
        const file = results.rows[0]
        chef.image = file.path.replace("public", "")

        // finding the image of each recipe
        async function getImage(recipeId) {
            let results = await File.findFiles(recipeId)
            const recipe_file = results.rows[0]

            const fileId = recipe_file.file_id
            results = await File.takeFiles(fileId)
            
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const recipesPromise = recipes.map(async recipe => {
            recipe.image = await getImage(recipe.id)
            recipe.chef_id = req.params.id
            recipe.chef = chef.name
            return recipe
        })

        recipes = await Promise.all(recipesPromise)

        return res.render("chefs/show", { chef, recipes })
        
    },
    create(req, res) {        
        return res.render("chefs/create")
    },
    async post(req, res) {
        
        try {
            const keys = Object.keys(req.body)
    
            for(let key of keys) {
                if(req.body[key] == "") return res.send("Please fill all fields")
            }
    
            if (req.files.length == 0) return res.send("Please, send at least one image")
    
            let results = await File.create({...req.files[0]})
            const fileId = results.rows[0].id
    
            results = await Chef.create(req.body, fileId)
            const chef = results.rows[0]
    
            return res.redirect(`/admin/chefs/${chef.id}`)
        } catch(err) {
            console.error(err)
        }

    },
    async edit(req, res) {

        const results = await Chef.find(req.params.id)
        const chef = results.rows[0]
        
        if (!chef) return res.send("chef not found!")

        return res.render("chefs/edit", { chef })
        
    },
    async put(req, res) {

        await Chef.update(req.body)
        return res.redirect(`/admin/chefs/${req.body.id}`)
    },
    async delete(req, res) {
        await Chef.delete(req.body.id)
        return res.redirect(`/admin/chefs/${req.body.id}`)
    }
}