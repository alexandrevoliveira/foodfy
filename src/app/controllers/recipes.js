const Recipe = require('../models/Recipe')


module.exports = {
    index(req, res) {
        
        const { filter } = req.query

        Recipe.all(filter, function(recipes){
            res.render("recipes/index", { recipes, filter })
        })
    },
    show(req, res) {

        const { id } = req.params

        Recipe.find(id, function(recipe) {
                recipe.ingredients = recipe.ingredients.filter(ingredient => ingredient != "")
                recipe.preparation = recipe.preparation.filter(eachprep => eachprep != "")
            res.render("recipes/show", { recipe })

        })
    },
    create(req, res) {   
        Recipe.chefsSelectedOptions(function(options){
            return res.render("recipes/create", { chefsOptions:options })
        })     
    },
    post(req, res) {
        // const keys = Object.keys(req.body)
    
        // for(let key of keys) {
        //     if(req.body[key] == "") return res.send("Please fill all fields")
        // }

        Recipe.create(req.body, function(recipe) {
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })
    },
    edit(req, res) {

        const { id } = req.params

        Recipe.find(id, function(recipe) {
            Recipe.chefsSelectedOptions(function(options){
                res.render("recipes/edit", { recipe, chefsOptions:options })
            })
        })
    },
    put(req, res) {

        Recipe.update(req.body, function(){
            res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },
    delete(req, res) {
        Recipe.delete(req.body.id, function(){
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    }
}