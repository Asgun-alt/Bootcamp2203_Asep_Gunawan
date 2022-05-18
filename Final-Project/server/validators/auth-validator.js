const { check } = require('express-validator')
const { compare } = require('bcryptjs')
const db = require('../db')

// user pasword validator
const password = check('password').isLength({ min: 6, max: 15 }).withMessage('minimum password length must be 6 to 15 characters')

// user email validator
// isEmail() going to check if the format is correct
const email = check('email').isEmail().withMessage('please provide a valid email')

// check if email already exist 
const isEmailExists = check('email').custom(async (value) => {
    const { rows } = await db.query(`SELECT * FROM users WHERE email = '${value}' `)

    if (rows.length) {
        throw new Error('Email already exists')
    }
})

const loginFieldsCheck = check('email').custom(async (value, { req }) => {

    const user = await db.query(`SELECT * FROM users WHERE email = '${value}' `)
    if (!user.rows.length) {
        throw new Error('Email does not exists')
    }

    const validPassword = await compare(req.body.password, user.rows[0].password)
    if (!validPassword) {
        throw new Error('Wrong password')
    }

    req.user = user.rows[0]
})

module.exports = {
    registerValidation: [email, password, isEmailExists],
    loginValidation: [loginFieldsCheck]
}