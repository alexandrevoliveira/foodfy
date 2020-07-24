const Chef = require('../models/Chef')


module.exports = {
    async index(req, res) {

        const results = await Chef.all()
        const chefs = results.rows

        return res.render("chefs/index", { chefs })
        
    },
    async show(req, res) {

        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        results = await Chef.showAllRecipes(req.params.id)
        const recipes = results.rows

        return res.render("chefs/show", { chef, recipes })
        
    },
    create(req, res) {        
        return res.render("chefs/create")
    },
    async post(req, res) {
        
        const keys = Object.keys(req.body)
    
        for(let key of keys) {
            if(req.body[key] == "") return res.send("Please fill all fields")
        }

        const results = await Chef.create(req.body)
        const chef = results.rows[0]

        return res.redirect(`/admin/chefs/${chef.id}`)

    },
    async edit(req, res) {

        const results = await Chef.find(req.params.id)
        const chef = results.rows[0]
        
        if (!chef) return res.send("chef not found!")

        return res.render("chefs/edit", { chef })
        
    },
    async put(req, res) {

        await Chef.update(req.body)
        return res.redirect(`/admin/chefs/${req.body.id}`)
    },
    async delete(req, res) {
        await Chef.delete(req.body.id)
        return res.redirect(`/admin/chefs/${req.body.id}`)
    }
}