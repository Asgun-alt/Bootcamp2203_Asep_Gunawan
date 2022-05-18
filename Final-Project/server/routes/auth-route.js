const { Router } = require('express')
const { loginValidation } = require('../validators/auth-validator')
const { getUsers, protected, register, login, logout } = require('../controllers/auth-controller')
const { validationMiddleware } = require('../middlewares/validation-middleware')
const { userAuth } = require('../middlewares/auth-middleware')
const { registerValidation } = require('../validators/auth-validator')
const router = Router()

router.get('/get-users', getUsers)
router.get('/protected', userAuth, protected)
router.post('/register', registerValidation, validationMiddleware, register)
router.post('/login', loginValidation, validationMiddleware, login)
router.get('/logout', logout)

module.exports = router