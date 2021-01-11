const User = require("../models/User")


async function post(req, res, next) {
    // checar se todos os campos estão preenchidos 
    const keys = Object.keys(req.body)

    for (key of keys) {
        if(req.body[key] == "" && req.body[key] != "is_admin") {
            return res.render('user/register', {
                user: req.body,
                error: 'Por favor, preencha todos os campos obrigatórios(*)'
            })
        }
    }

    // so cadastra se o campo de email estiver correto
    const { email } = req.body

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if(!email.match(mailFormat)) return res.render('user/register', {
        user: req.body,
        error: 'Email inválido'
    })

    // checar se há usuário existente

    const user = await User.findOne({
        where: { email }
    })

    if (user) return res.render('user/register', {
        user: req.body,
        error: 'Usuário já cadastrado.'
    })

    next()
}

module.exports = {
    post
}