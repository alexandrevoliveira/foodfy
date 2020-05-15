const express = require('express')
const routes = express.Router()
const data = require('./data.json')
const recipes = require('./controllers/recipes')



routes.get("/", function(req, res) {
    res.redirect("/admin/recipes")
})

routes.get("/admin/recipes", recipes.index)

routes.get("/admin/recipes/create", recipes.create)

routes.get("/admin/recipes/:id", recipes.show)


module.exports = routes