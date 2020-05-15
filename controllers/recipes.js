const data = require('../data.json')
const fs = require('fs')

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

// post
exports.post = function(req, res) {
    
    const keys = Object.keys(req.body)

    for (let key of keys) {
        if (req.body[key] == "") return res.send("Please fill all the fields")
    }

    let id = 1
    const lastRecipe = data.recipes[data.recipes.length - 1]
    if (lastRecipe) {
        id = lastRecipe.id + 1
    }
    
    const lastIngredient = req.body.ingredients[req.body.ingredients.length - 1]
    if (lastIngredient == "") {
        req.body.ingredients.pop(lastIngredient)
    }

    const lastPreparation = req.body.preparation[req.body.preparation.length - 1]
    if (lastPreparation == "") {
        req.body.preparation.pop(lastPreparation)
    }

    data.recipes.push({
        id,
        ...req.body        
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Writing data error")

        return res.redirect("/admin/recipes")
    })

    
}