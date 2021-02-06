const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const { usersOnly, allowedOnly } = require('../app/middlewares/session')

const recipes = require('../app/controllers/recipesController')

// recipes
routes.get("/", recipes.index)
routes.get("/create", usersOnly, recipes.create)
routes.get("/:id", recipes.show)
routes.get("/:id/edit", allowedOnly, recipes.edit)
routes.post("/", usersOnly, multer.array("photos", 5), recipes.post)
routes.put("/", multer.array("photos", 5), recipes.put)
routes.delete("/", recipes.delete)

module.exports = routes