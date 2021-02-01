const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const { adminOnly } = require('../app/middlewares/session')

const chefs = require('../app/controllers/chefsController')

// chefs
routes.get("/", chefs.index)
routes.get("/create", adminOnly, chefs.create)
routes.get("/:id", chefs.show)
routes.get("/:id/edit", adminOnly, chefs.edit)
routes.post("/", adminOnly, multer.array('photo', 1), chefs.post)
routes.put("/", adminOnly, multer.array('photo', 1), chefs.put)
routes.delete("/", adminOnly, chefs.delete)

module.exports = routes