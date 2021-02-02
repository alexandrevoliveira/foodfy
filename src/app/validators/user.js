const User = require("../models/User")

function checkAllFields(body) {
    // checar se todos os campos estão preenchidos 
    const keys = Object.keys(body)

    for (key of keys) {
        if(body[key] == "" && body[key] != "is_admin") {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos obrigatórios(*)'
            }
        }
    }
}

async function post(req, res, next) {

    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) return res.render('user/register', fillAllFields)

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

async function put(req, res, next) {

    // check if all fields were filled
    const fillAllFields = checkAllFields(req.body)
    if (fillAllFields) return res.render("user/edit", fillAllFields)

    const { id, email } = req.body
    
    // check mailFormat
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(!email.match(mailFormat)) return res.render("user/edit", {
        user: req.body,
        error: "Formato de email inválido, por favor tente novamente"
    })

    const user = await User.findOne({ where: { id } })

    req.user = user

    next()
}

module.exports = {
    post,
    put
}