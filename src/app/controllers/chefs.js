const Chef = require('../models/Chef')
const File = require('../models/File')


module.exports = {
    async index(req, res) {

        let results = await Chef.all()
        let chefs = results.rows

        async function getImage(file_id) {
            let results = await File.takeFiles(file_id)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const chefsPromise = chefs.map(async chef => {
            chef.image = await getImage(chef.file_id)
            return chef
        })

        chefs = await Promise.all(chefsPromise)

        return res.render("chefs/index", { chefs })
        
    },
    async show(req, res) {
        try{ 
            // find chef
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            // show chef's recipes
            results = await Chef.showAllRecipes(req.params.id)
            let recipes = results.rows

            // finding chefs' image
            results = await File.takeFiles(chef.file_id)
            const file = results.rows[0]
            if(!file){
                chef.image = `//placehold.it/500x500?text=IMAGE NOT AVAILABLE`
            }else{
                chef.image = file.path.replace("public", "")
            }

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
            } catch(err) {
                console.error(err)
            }
        
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

        try {
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]
            
            if (!chef) return res.send("chef not found!")

            results = await File.takeFiles(chef.file_id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
            
            return res.render("chefs/edit", { chef, files })
        }catch(err){
            console.error(err)
        }
        
    },
    async put(req, res) {
        try{
            const keys = Object.keys(req.body)
            for (key of keys) {
                if(req.body[key] == "" && key != "removed_files") {
                    res.send("Please, send at least one image")
                }
            }

            if(req.files.length != 0) {
                let results = await File.create({...req.files[0]})
                const fileId = results.rows[0].id
                await Chef.update(req.body, fileId)
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                await Promise.all(removedFilesPromise)
            }

            return res.redirect(`/admin/chefs/${req.body.id}`)
        }catch(err){
            console.error(err)
        }
    },
    async delete(req, res) {
        await Chef.delete(req.body.id)
        return res.redirect(`/admin/chefs/${req.body.id}`)
    }
}