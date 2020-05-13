const express = require('express')
const routes = express.Router()
const data = require('./data.json')



routes.get("/", function(req, res) {
    res.redirect("/admin/recipes")
})

routes.get("/admin/recipes", function(req, res) {
    res.render("index", { plates: data.plates})
})

routes.get("/admin/recipes/:id", function(req, res) {
    const { id } = req.params

    const foundPlate = data.plates.find(function(plate){
        return plate.id == id
    })

    if(!foundPlate) {
        return res.send("Plate not found!")
    }

    return res.render("show", { plate: foundPlate })
})

module.exports = routes