const Chef = require('../models/Chef')


module.exports = {
    index(req, res) {

        Chef.all(function(chefs){
            res.render("chefs/index", { chefs })
        })
    },
    show(req, res) {

        const { id } = req.params

        Chef.find(id, function(chef) {
            res.render("chefs/show", { chef })

        })
    },
    create(req, res) {        
        return res.render("chefs/create")
    },
    post(req, res) {
        // const keys = Object.keys(req.body)
    
        // for(let key of keys) {
        //     if(req.body[key] == "") return res.send("Please fill all fields")
        // }

        Chef.create(req.body, function(chef) {
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },
    edit(req, res) {

        const { id } = req.params

        Chef.find(id, function(chef) {
            return res.render("chefs/edit", { chef })

        })
    },
    put(req, res) {

        Chef.update(req.body, function(){
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    delete(req, res) {
        Chef.delete(req.body.id, function(){
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    }
}