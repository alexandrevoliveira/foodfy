const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        try {

            let results,
                params = {}

            const { filter } = req.query

            if(!filter) return res.redirect("/")

            params.filter = filter

            results = await Recipe.search(params)
            
            async function getImage(recipeId) {
                let results = await File.findFiles(recipeId)
                const recipe_file = results.rows[0]

                const fileId = recipe_file.file_id
                results = await File.takeFiles(fileId)

                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
                
                return files[0]
            }

            const recipesPromise = results.rows.map(async recipe => {
                recipe.image = await getImage(recipe.id)
                return recipe
            })

            const recipes = await Promise.all(recipesPromise)

            const search = {
                term: req.query.filter,
                total: recipes.length
            }

            return res.render("search/index", { recipes, search })

        } catch(err) {
            console.error(err)
        }
    }
}