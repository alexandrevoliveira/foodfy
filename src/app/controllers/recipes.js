const Recipe = require('../models/Recipe')


module.exports = {
    async index(req, res) {
        
        const { filter } = req.query

        const results = await Recipe.all(filter)
        const recipes = results.rows

        return res.render("recipes/index", { recipes, filter })
    },
    async show(req, res) {

        const results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        recipe.ingredients = recipe.ingredients.filter(ingredient => ingredient != "")
        recipe.preparation = recipe.preparation.filter(eachprep => eachprep != "")

        return res.render("recipes/show", { recipe })
    },
    async create(req, res) {   
        const results = await Recipe.chefsSelectedOptions()
        const chefsOptions = results.rows

        return res.render("recipes/create", { chefsOptions })
    },
    async post(req, res) {
        // const keys = Object.keys(req.body)
    
        // for(let key of keys) {
        //     if(req.body[key] == "") return res.send("Please fill all fields")
        // }

        // create recipe
        const results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        return res.redirect(`/admin/recipes/${recipeId}`)
    },
    async edit(req, res) {

        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        results = await Recipe.chefsSelectedOptions()
        const chefsOptions = results.rows

        return res.render("recipes/edit", { recipe, chefsOptions })
    },
    async put(req, res) {

        await Recipe.update(req.body)

        return res.redirect(`/admin/recipes/${req.body.id}`)
    },
    async delete(req, res) {
        await Recipe.delete(req.body.id)
        
        return res.redirect(`/admin/recipes/${req.body.id}`)
    }
}