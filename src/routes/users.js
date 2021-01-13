const express = require('express')
const routes = express.Router()

const UserValidator = require('../app/validators/user')

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

// session controller
routes.get('/login', SessionController.loginForm)
// routes.post('/login', SessionController.login)
// routes.post('/logout', SessionController.logout)

// user register
routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post) // Cadastrar um usuário
// routes.get('/', UserController.list) // Mostrar a lista de usuários cadastrados
// routes.put('/', UserController.put) // Editar um usuário
// routes.delete('/', UserController.delete) // Deletar um usuário

module.exports = routes