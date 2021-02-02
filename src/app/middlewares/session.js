const User = require('../models/User')

async function adminOnly(req, res, next) {
    if(!req.session.userId) return res.redirect('/admin/users/login')
    const { userId: id } = req.session

    const user = await User.findOne({ where: { id } })
    if(user.is_admin != true) return res.redirect('/admin/profile')

    next()
}

module.exports = {
    adminOnly
}