const Recipe = require('../models/Recipe')


module.exports = {
    index(req, res) {

        Recipe.all(function(recipes){
            res.render("recipes/index", { recipes })
        })
    },
    show(req, res) {
        res.render("recipes/index")
    },
    create(req, res) {
        res.render("recipes/index")
    },
    post(req, res) {
        res.render("recipes/index")
    },
    edit(req, res) {
        res.render("recipes/index")
    },
    put(req, res) {
        res.render("recipes/index")
    },
    delete(req, res) {
        res.render("recipes/index")
    }
}