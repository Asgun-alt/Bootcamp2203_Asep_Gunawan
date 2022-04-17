const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = process.env.port || 3000
const morgan = require('morgan')
const bcrypt = require('bcrypt')
const passport = require('passport')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

// initialize database and get functions
// const pool = require('./db')
const { pool } = require('./services/db_config')


// initialize flash message session
var flash = require('express-flash')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var sessionStore = new session.MemoryStore;


// initialize passport
// call passport config function
const initializePassport = require('./services/passportConfig')
initializePassport(passport)

// initialize multer
// determines where the image is stored
const fileImageStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        // the first argument is any erros that occurs, pass null
        callback(null, 'public/product-images')
    },
    // differentiate each files name so it'll be unique 
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: fileImageStorage })
// determines where the user image is stored
const fileUserImageStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        // the first argument is any erros that occurs, pass null
        callback(null, 'public/user-images')
    },
    // differentiate each files name so it'll be unique 
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname)
    }
})
const upload_user_image = multer({ storage: fileUserImageStorage })


// Information using EJS
app.set('view engine', 'ejs')
//serve static file 
app.use(express.static('public'))
app.use('/public/', express.static('./public'))
app.use(express.urlencoded({ extended: false }))
app.use(expressLayouts);

// configure flash message
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'false',
    saveUninitialized: 'false'
}))
app.use(flash())

// custom flash middleware
app.use((req, res, next) => {
    res.locals.sessionFlash = req.sessionFlash
    delete req.session.sessionFlash
    next()
})

// function to initialize passport
app.use(passport.initialize())
//store our variable accross session
app.use(passport.session())

// middleware logger with morgan
var logStream = fs.createWriteStream(path.join(__dirname, 'access_log.log'), { flags: 'a' })
app.use(morgan(':method :url :status :remote-user :date', { stream: logStream }))


// render login page
app.get('/', (req, res) => {
    res.render('login', {
        title: 'login',
        layout: './layouts/login_layouts',
    })
})
app.post("/login/user", passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/',
    failureFlash: true
}))

app.get("/logout/user", (req, res) => {
    req.logout()
    req.flash('success_message', "You have logged out")
    res.redirect('/')
});


// render register page
app.get('/register', checkAuthenticated, (req, res) => {

    res.render('register', {
        layout: './layouts/main_layouts',
    });
})

// register new user process
app.post('/register/new_user', upload_user_image.single('user_image'), async (req, res) => {
    try {
        const { fullname, username, email, password, confirm_password, role } = req.body
        const user_image = req.file.path.replace(/\\/g, '/')

        let errors = []

        // form validation
        if (!fullname || !username || !email || !password || !confirm_password || !role) {
            errors.push({ message: 'fields must not empty' })
        }

        if (password.length < 8) {
            errors.push({ message: 'password must be at least 8 characters' })
        }
        if (password !== confirm_password) {
            errors.push({ message: 'password do not match' })
        }

        console.log({ fullname, username, email, password, confirm_password, role, user_image })

        if (errors.length > 0) {
            res.render('register', {
                layout: './layouts/main_layouts',
                errors
            });
        } else {
            // form validation has passed
            let hashedPassword = await bcrypt.hash(password, 10)
            console.log(hashedPassword)

            pool.query(
                `SELECT * FROM users
                WHERE email = $1`, [email], (error, results) => {
                if (error) {
                    console.error(error.message)
                }
                console.log(results.rows)

                if (results.rows.length > 0) {
                    errors.push({ message: 'Email already registered!' })
                    res.render('register', { errors })
                } else {
                    // there is no duplicate
                    // register new user
                    pool.query(
                        `INSERT INTO users (fullname, username, email, password, role, user_image)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        RETURNING user_id, password`, [fullname, username, email, hashedPassword, role, user_image], (error, results) => {
                        if (error) {
                            console.error(error.message)
                        }
                        console.log(results.rows)
                        req.flash('message', 'You are now registered')
                        res.redirect('/')

                    }
                    )
                }

            }
            )
        }
    } catch (error) {
        console.error(error.message)
    }
})

// render user list page
app.get('/user_list', async (req, res) => {

    const getAllUser = await pool.query('SELECT * FROM users')

    res.render('user_list', {
        title: 'user list page',
        layout: './layouts/main_layouts',
        getUsers: getAllUser.rows
    });
})
// update user 
app.get('/user/update_user/:user_id', async (req, res) => {
    try {
        const params_user_id = req.params.user_id
        const { rows: get_user_detail } = await pool.query(`SELECT * FROM users WHERE user_id = '${params_user_id}'`)
        get_user_detail.map(user_detail => {
            res.render('update_user', {
                title: 'form update user',
                layout: './layouts/main_layouts',
                get_user_detail,
                user_detail
            })
        })
    } catch (error) {
        console.error(error.message)
    }
})
// process update user
app.post('/update/user', async (req, res) => {
    try {
        let { user_id, fullname, username, email, password, role } = req.body
        const { new_user_image, old_user_image } = req.file.path.replace(/\\/g, '/')
        let hashedPassword = await bcrypt.hash(password, 10)

        if (new_user_image === '') {
            await pool.query(`UPDATE users SET fullname = '${fullname}', username = '${username}', email = '${email}', password = '${hashedPassword},role = '${role}', user_image = '${old_user_image}' WHERE product_id = '${user_id}' `)
        } else {
            await pool.query(`UPDATE users SET fullname = '${fullname}', username = '${username}', email = '${email}', password = '${hashedPassword},role = '${role}', user_image = '${new_user_image}' WHERE product_id = '${user_id}' `)
        }

        res.redirect('/user_list')
    } catch (error) {
        console.error(error.message)
    }
})
// process delete user
app.get('/user/delete_user/:user_id', async (req, res) => {
    try {
        // cek nama jika ada
        const checkUserId = await pool.query(`SELECT user_id FROM users WHERE user_id = '${req.params.user_id}'`)
        if (checkUserId.rowCount == 0) {
            res.redirect('/user_list')
        } else {
            await pool.query(`DELETE FROM users WHERE user_id = '${req.params.user_id}'`)
            res.redirect('/user_list')
        }
    } catch (error) {
        console.error(error.message)
    }
})



// render index page
app.get('/index', checkAuthenticated, async (req, res) => {
    try {
        const getAllProduct = await pool.query('SELECT * FROM products')
        res.render('index', {
            title: 'Dashboard page',
            layout: './layouts/main_layouts',
            products: getAllProduct.rows,
            success_message: req.flash('success_message'),
            fail_message: req.flash('fail_message')
        });
    } catch (error) {
        console.log(error.message)
    }
})


// render product list page
app.get('/product_list', async (req, res) => {
    try {
        const getAllProduct = await pool.query('SELECT * FROM products')
        res.render('product_list', {
            title: 'product list',
            products: getAllProduct.rows,
            layout: './layouts/main_layouts'
        });
    } catch (error) {
        console.log(error.message)
    }
})


// render add product page
app.get('/add_product', (req, res) => {

    res.render('add_product', {
        title: 'add product',
        layout: './layouts/main_layouts'
    });
})
// process add product
app.post('/product/addproduct', upload.single('product_image'), async (req, res) => {
    try {
        // res.send('image uploaded')
        const { productName, price, description } = req.body
        const product_image = req.file.path.replace(/\\/g, '/')
        console.log(product_image)
        await pool.query(`INSERT INTO products (product_name, price, description, product_image) VALUES ('${productName}', '${price}', '${description}', '${product_image}') RETURNING *`)
        req.flash('success_message', 'new data has been added')
        res.redirect('/product_list')
    } catch (error) {
        console.error(error.message)
    }
})


// render detail product page
app.get('/product/detail_product/:product_id', async (req, res) => {
    try {
        const params_product_id = req.params.product_id
        const { rows: get_product_detail } = await pool.query(`SELECT * FROM products WHERE product_id = '${params_product_id}'`)
        get_product_detail.map(product_detail => {
            // console.log(product_detail)
            res.render('detail_product', {
                title: 'detail product',
                layout: './layouts/main_layouts',
                get_product_detail,
                product_detail
            })
        })
    } catch (error) {
        console.error(error.message)
    }
})


// update product
app.get('/product/update_product/:product_id', async (req, res) => {
    try {
        const params_product_id = req.params.product_id
        const { rows: get_product_detail } = await pool.query(`SELECT * FROM products WHERE product_id = '${params_product_id}'`)
        get_product_detail.map(product_detail => {
            res.render('update_product', {
                title: 'form update product',
                layout: './layouts/main_layouts',
                get_product_detail,
                product_detail
            })
        })
    } catch (error) {
        console.error(error.message)
    }
})
// update product process
app.post('/product/update_product', async (req, res) => {
    try {
        let { product_id, product_name, price, description } = req.body
        const { new_product_image, old_product_image } = req.file.path.replace(/\\/g, '/')

        if (new_product_image === '') {
            await pool.query(`UPDATE products SET product_name = '${product_name}', price = '${price}', description = '${description}', product_image = '${old_product_image}' WHERE product_id = '${product_id}' `)
        } else {
            await pool.query(`UPDATE products SET product_name = '${product_name}', price = '${price}', description = '${description}', product_image = '${new_product_image}' WHERE product_id = '${product_id}' `)
        }

        res.redirect('/product_list')
    } catch (error) {
        console.error(error.message)
    }
})
// process delete product
app.get('/product/delete_product/:product_id', async (req, res) => {
    try {
        // cek nama jika ada
        const checkProductId = await pool.query(`SELECT product_id FROM products WHERE product_id = '${req.params.product_id}'`)
        if (checkProductId.rowCount == 0) {
            res.redirect('/index')
        } else {
            await pool.query(`DELETE FROM products WHERE product_id = '${req.params.product_id}'`)
            res.redirect('/index')
        }
    } catch (error) {
        console.error(error.message)
    }
})


// render selling list page
app.get('/selling_list', async (req, res) => {

    const { rows: selling_list_result } = await pool.query(
        `SELECT
        *
        FROM
            selling as se
        INNER JOIN products as po 
            ON se.product_id = po.product_id
        INNER JOIN users us 
            ON se.user_id = us.user_id `
    )

    console.log(selling_list_result)

    selling_list_result.map(selling_list => {
        res.render('selling_list', {
            title: 'selling list page',
            layout: './layouts/main_layouts',
            selling_list_result,
            selling_list
        })
    }
    )

})

app.get('/selling_list/:product_id', async (req, res) => {

    const params_product_id = req.params.product_id
    const params_user_id = req.user.user_id

    // get current date data
    var timestamp = new Date();
    var dd = String(timestamp.getDate()).padStart(2, '0');
    var mm = String(timestamp.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = timestamp.getFullYear();
    timestamp = mm + '/' + dd + '/' + yyyy;

    await pool.query(`INSERT INTO selling (product_id, user_id, date) VALUES ('${params_product_id}', '${params_user_id}', '${timestamp}') RETURNING *`)
    res.redirect('/selling_list')

})


app.use('/', (req, res) => {
    // set status code to 404
    res.status(404)
    res.send('Error 404: Page not found')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/product_list");
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})