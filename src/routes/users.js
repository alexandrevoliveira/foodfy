const express = require('express')
const routes = express.Router()

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const { adminOnly } = require('../app/middlewares/session')

// session controller
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// user register
routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post) // Cadastrar um usuário
routes.get('/', adminOnly, UserController.list) // Mostrar a lista de usuários cadastrados
// routes.put('/', UserController.put) // Editar um usuário
// routes.delete('/', UserController.delete) // Deletar um usuário

module.exports = routes