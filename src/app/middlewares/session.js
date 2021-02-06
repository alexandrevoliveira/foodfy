const User = require('../models/User')
const Recipe = require('../models/Recipe')

async function usersOnly(req, res, next) {
    if(!req.session.userId) return res.redirect('/admin/users/login')
    next()
}

async function adminOnly(req, res, next) {
    if(!req.session.userId) return res.redirect('/admin/users/login')
    const { userId: id } = req.session

    const user = await User.findOne({ where: { id } })
    if(user.is_admin != true) return res.redirect('/admin/recipes')

    next()
}

async function allowedOnly(req, res, next) {

    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]
    
    if(!recipe) return res.redirect("/admin/recipes")

    if(!req.session.userId) return res.redirect('/admin/users/login')

    const { userId: id } = req.session
    const user = await User.findOne({ where: { id } })

    // users can only edit their own recipes, and admins can edit whatever recipe
    if((user.id == recipe.user_id) || (user.is_admin)) {
        next()
    } else {
        return res.redirect('/admin/recipes')
    }
}

module.exports = {
    usersOnly,
    adminOnly,
    allowedOnly
}