const express = require('express')
const routes = express.Router()

const home = require('../app/controllers/homeController')
const search = require('../app/controllers/searchController')

const users = require('./users')
const recipes = require('./recipes')
const chefs = require('./chefs')

// home
routes.get("/", home.index)

// search
routes.get("/recipes/search", search.index)

// users
routes.use("/admin/users", users)
// routes.get('/admin/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
// routes.put('/admin/profile', ProfileController.put) // Editar o usuário logado

// recipes
routes.use("/admin/recipes", recipes)

// chefs
routes.use("/admin/chefs", chefs)

module.exports = routes