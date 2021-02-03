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

// password forgot / reset
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
// routes.post('/forgot-password', SessionController.forgot)
// routes.post('/password-reset', SessionController.reset)

// user register
routes.get('/register', adminOnly, UserController.registerForm)
routes.post('/register', adminOnly, UserValidator.post, UserController.post) // Cadastrar um usuário
routes.get('/', adminOnly, UserController.list) // Mostrar a lista de usuários cadastrados
routes.get('/:id', adminOnly, UserController.show) // Mostra um único usuário cadastrado
routes.put('/', adminOnly, UserValidator.put, UserController.put) // Editar um usuário
// routes.delete('/', UserController.delete) // Deletar um usuário

module.exports = routes