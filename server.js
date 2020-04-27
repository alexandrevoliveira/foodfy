const express = require('express')
const nunjucks = require('nunjucks')
const plates = require('./data')

const server = express()

server.use(express.static('public'))

server.set("view engine", "njk")

nunjucks.configure("views",{
    express: server
})

server.get("/", function(req, res) {
    res.render("main", { plates })
})

server.get("/about", function(req, res) {
    res.render("about")
})

server.get("/recipes", function(req, res) {
    res.render("recipes", { plates })
})

server.listen(5000, function(){
    console.log("server is running")
})