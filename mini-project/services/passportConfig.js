const LocalStrategy = require('passport-local').Strategy
const { pool } = require('./db_config')
const bcrypt = require('bcrypt')

function initialize(passport) {
    const authenticateUser = (email, password, done) => {

        pool.query(
            `SELECT * FROM users WHERE email = $1`, [email], (error, results) => {

                if (error) {
                    console.error(error.message)
                }
                console.log(results.rows)

                if (results.rows.length > 0) {
                    // passing the user object to the result
                    const user = results.rows[0]

                    bcrypt.compare(password, user.password, (error, isMatch) => {
                        if (error) {
                            console.error(error.message)
                        }

                        if (isMatch) {
                            // done function takes few parameters
                            // first parameter is error, set to null so there is no error
                            // second parameter return the user and store it in session cookie
                            return done(null, user)
                        } else {
                            // if the password is incorrect
                            // set to false to prevent from sending it to the user
                            return done(null, false, { message: 'password is incorrect' })
                        }
                    })

                } else {
                    // if there is no user to be found in database 
                    return done(null, false, { message: 'email is not registered' })
                }

            }
        )

    }

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        authenticateUser
    )
    )


    // store user id in the session cookies
    passport.serializeUser((user, done) => done(null, user.user_id))

    // use user id to obtain user details from database
    passport.deserializeUser((user_id, done) => {
        pool.query(
            `SELECT * FROM users WHERE user_id = ${user_id}`, (error, results) => {
                if (error) {
                    console.error(error.message)
                }
                // store user object in the session
                return done(null, results.rows[0])
            }
        )
    })

}

module.exports = initialize;