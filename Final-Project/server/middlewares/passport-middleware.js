const passport = require('passport')
const { Strategy } = require('passport-jwt')
const { SECRET } = require('../constant')
const db = require('../db')

function cookieExtractor(req) {
    let token = null
    if (req && req.cookies) token = req.cookies['token']
    return token
}

const Options = {
    secretOrKey: SECRET,
    jwtFromRequest: cookieExtractor
}

passport.use(
    new Strategy(Options, async ({ id }, done) => {
        try {
            const { rows } = await db.query(`SELECT user_id, email FROM users WHERE user_id = '${id}' `)
            if (!rows.length) {
                throw new Error('401: NOT AUTHORIZED')
            }

            let user = { id: rows[0].user_id, email: rows[0].email }
            return await done(null, user)

        } catch (error) {
            console.log(error.message)
            done(null, false)
        }
    })
)