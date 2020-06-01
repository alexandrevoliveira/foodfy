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
        id = Number(lastRecipe.id) + 1
    }

    let ingredients = req.body.ingredients.filter(function(ingredient) {
        return ingredient != ""
    })

    let preparation = req.body.preparation.filter(function(item) {
        return item != ""
    })

    data.recipes.push({
        id,
        ...req.body,        
        ingredients,
        preparation
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Writing data error")

        return res.redirect("/admin/recipes")
    })    
}

// edit

exports.edit = function(req, res) {
    const { id } =  req.params

    const foundRecipe = data.recipes.find(function(recipe) {
        return recipe.id == id
    })

    if (!foundRecipe) {
        return res.send("Plate not found!")
    }

    return res.render("edit", { recipe: foundRecipe })
}

exports.put = function(req, res) {
    const { id } = req.body
    let index = 0

    const foundRecipe = data.recipes.find(function(recipe, foundIndex) {
        if ( recipe.id == id ) {
            index = foundIndex
            return true
        }
    })

    if(!foundRecipe) return res.send("Recipe not found")

    const filterIngredient = req.body.ingredients.filter(ingredient => ingredient != "")
    const filterPreparation = req.body.preparation.filter(item => item != "")

    const recipe = {
        id: Number(foundRecipe.id),
        ...foundRecipe,
        ingredients: filterIngredient,
        preparation: filterPreparation
    }

    data.recipes[index] = recipe

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Writing data error")

        return res.redirect(`/admin/recipes`)
    })
}

exports.delete = function(req, res) {
    const { id } = req.body

    const filteredRecipes = data.recipes.filter(function(recipe) {
        return recipe.id != id
    })

    data.recipes = filteredRecipes

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Writing data error")

        return res.redirect("/admin/recipes")
    })
}