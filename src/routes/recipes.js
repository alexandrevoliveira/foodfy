const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const { adminOnly } = require('../app/middlewares/session')

const recipes = require('../app/controllers/recipesController')

// recipes
routes.get("/", recipes.index)
routes.get("/create", adminOnly, recipes.create)
routes.get("/:id", recipes.show)
routes.get("/:id/edit", adminOnly, recipes.edit)
routes.post("/", adminOnly, multer.array("photos", 5), recipes.post)
routes.put("/", adminOnly, multer.array("photos", 5), recipes.put)
routes.delete("/", adminOnly, recipes.delete)

module.exports = routes