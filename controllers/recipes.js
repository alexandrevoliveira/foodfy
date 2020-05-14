const data = require('../data.json')

// index
exports.index = function(req, res) {
    res.render("index", { recipes: data.recipes})
}

// show
exports.show = function(req, res) {
    const { id } = req.params

    const foundRecipe = data.recipes.find(function(recipe){
        return recipe.id == id
    })

    if(!foundRecipe) {
        return res.send("Recipe not found!")
    }

    return res.render("show", { recipe: foundRecipe })
}

// create
exports.create = function(req, res) {
    return res.render("create")
}