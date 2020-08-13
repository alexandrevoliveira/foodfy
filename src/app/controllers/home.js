const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        try{
            let results = await Recipe.all()
            let recipes = results.rows

            async function getImage(recipeId) {
                let results = await File.findFiles(recipeId)
                const recipe_file = results.rows[0] // precisa pegar apenas uma row(linha) da tabela(recipe_files) que relaciona recipes e files

                const fileId = recipe_file.file_id
                results = await File.takeFiles(fileId)

                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)            
                
                return files[0]
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.image = await getImage(recipe.id)
                return recipe
            })

            recipes = await Promise.all(recipesPromise)

            res.render("home/index", { recipes })
        } catch(err) {
            console.error(err)
        }
    }
}