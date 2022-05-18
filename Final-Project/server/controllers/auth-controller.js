const db = require('../db')
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constant')

exports.getUsers = async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT user_id, email FROM users`)

        return res.status(200).json()
    } catch (error) {
        console.log(error.message)
    }
}

exports.protected = async (req, res) => {
    try {
        return res.status(200).json()
    } catch (error) {
        console.log(error.message)
    }
}

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body
    try {
        const hashedPassword = await hash(password, 10)

        await db.query(`INSERT INTO users (username, email, password, role) VALUES ( '${username}','${email}', '${hashedPassword}', '${role}' )`)

        return res.status(201).json({
            success: true,
            message: 'register new user success'
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            error: error.message
        })
    }
}

exports.login = async (req, res) => {
    const user = req.user
    payload = {
        id: user.user_id,
        email: user.email,
        username: user.username,
        image: user.user_image
    }

    try {
        const token = await sign(payload, SECRET, { expiresIn: '1h' })

        return res.status(200).cookie('token', token, { httpOnly: true }).json()
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            error: error.message
        })
    }
}

exports.logout = async (req, res) => {
    try {
        return res.status(200).clearCookie('token', { httpOnly: true }).json({
            success: true,
            message: 'Logged out success'
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            error: error.message
        })
    }
}