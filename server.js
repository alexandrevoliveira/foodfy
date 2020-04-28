const express = require('express')
const nunjucks = require('nunjucks')
const plates = require('./data')

const server = express()

server.use(express.static('public'))

server.set("view engine", "njk")

nunjucks.configure("views",{
    express: server,
    autoescape: false,
    noCache: true
})

server.get("/", function(req, res) {
    res.render("main", { plates })
})

server.get("/about", function(req, res) {
    res.render("about")
})

server.get("/recipes/:index", function(req, res) {
    const recipes = plates
    const recipeIndex = req.params.index
    
    const recipe = recipes[recipeIndex]

    return res.render("recipes", { plate: recipe })
})

server.listen(5000, function(){
    console.log("server is running")
})