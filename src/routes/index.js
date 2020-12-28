const express = require('express')
const routes = express.Router()

const home = require('../app/controllers/homeController')
const search = require('../app/controllers/searchController')

const recipes = require('./recipes')
const chefs = require('./chefs')

// home
routes.get("/", home.index)

// search
routes.get("/recipes/search", search.index)

// recipes
routes.use("/admin/recipes", recipes)

// chefs
routes.use("/admin/chefs", chefs)

module.exports = routes