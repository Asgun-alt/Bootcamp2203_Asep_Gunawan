const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = process.env.port || 3000
const morgan = require('morgan')
const bcrypt = require('bcrypt')
const passport = require('passport')
const multer = require('multer')
const fs = require('fs')
const Path = require('path')

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
        callback(null, 'public/product_images')
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
        callback(null, 'public/user_images')
    },
    // differentiate each files name so it'll be unique 
    filename: (req, file, callback) => {
        callback(null, Date.now() + '_' + file.originalname)
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
var logStream = fs.createWriteStream(Path.join(__dirname, 'access_log.log'), { flags: 'a' })
app.use(morgan(':method :url :status :remote-user :date', { stream: logStream }))


// render login page
app.get('/', checkAuthenticated, (req, res) => {
    res.render('login', {
        title: 'login',
        layout: './layouts/login_layouts',
        success_message: req.flash('success_message')
    })
})
app.post("/login/user", passport.authenticate('local', {
    successRedirect: '/product_list',
    failureRedirect: '/',
    failureFlash: true
}))

app.get("/logout/user", (req, res) => {
    req.logout()
    req.flash('success_message', "You have logged out")
    res.redirect('/')
});


// render register page
app.get('/register', checkNotAuthenticated,  (req, res) => {

    res.render('register', {
        layout: './layouts/main_layouts',
        success_message: req.flash('success_message'),
        failed_message: req.flash('fail_message')
    });
})

// register new user process
app.post('/register/new_user', checkNotAuthenticated, upload_user_image.single('user_image'), async (req, res) => {
    try {
        const { fullname, username, email, password, confirm_password, role } = req.body
        const user_image = req.file.path.replace(/\\/g, '/')

        let errors = []

        // form validation
        if (!fullname || !username || !email || !password || !confirm_password || !role) {
            req.flash('failed_message', 'Fields must not be empty')
        }

        if (password.length < 8) {
            req.flash('failed_message', 'Password must be at least 8 characters')
        }
        if (password !== confirm_password) {
            req.flash('failed_message', 'Password do not match')
        }

        // console.log({ fullname, username, email, password, confirm_password, role, user_image })

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
                // console.log(results.rows)

                if (results.rows.length > 0) {
                    req.flash('failed_message', 'Email already registered')
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
                        // console.log(results.rows)
                        req.flash('success_message', 'You are now registered')
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
app.get('/user_list', checkNotAuthenticated, async (req, res) => {

    const getAllUser = await pool.query('SELECT * FROM users')

    res.render('user_list', {
        title: 'user list page',
        layout: './layouts/main_layouts',
        getUsers: getAllUser.rows,
        success_message: req.flash('success_message'),
        failed_message: req.flash('fail_message')
    });
})
// update user 
app.get('/user/update_user/:user_id', checkNotAuthenticated, async (req, res) => {
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
app.post('/update/user', checkNotAuthenticated, async (req, res) => {
    try {
        let { user_id, fullname, username, email, password, oldPassword, role, old_user_image } = req.body
        // console.log(password)
        // console.log(hashedPassword)
        
        if (!req.file && password === undefined) {
            // await pool.query(`UPDATE users SET fullname = '${fullname}', username = '${username}', email = '${email}', password = '${oldPassword},role = '${role}', user_image = '${old_user_image}' WHERE product_id = '${user_id}' `)
            req.flash('success_message', 'User has been updated')
            res.redirect('/user_list')
        } else {
            let saltPassword = await bcrypt.genSalt(10)
            let hashedPassword = await bcrypt.hash(password, saltPassword)
            const { new_user_image } = req.file.path.replace(/\\/g, '/')
            // await pool.query(`UPDATE users SET fullname = '${fullname}', username = '${username}', email = '${email}', password = '${hashedPassword},role = '${role}', user_image = '${new_user_image}' WHERE product_id = '${user_id}' `)
            req.flash('success_message', 'User has been updated')
            res.redirect('/user_list')
        }

    } catch (error) {
        console.error(error.message)
    }
})
// process delete user
app.get('/user/delete_user/:user_id', checkNotAuthenticated, async (req, res) => {
    try {
        // cek nama jika ada
        const checkUserId = await pool.query(`SELECT user_id FROM users WHERE user_id = '${req.params.user_id}'`)
        if (checkUserId.rowCount == 0) {
            res.redirect('/user_list')
        } else {
            await pool.query(`DELETE FROM users WHERE user_id = '${req.params.user_id}'`)
            req.flash('success_message', 'User has been deleted')
            res.redirect('/user_list')
        }
    } catch (error) {
        console.error(error.message)
    }
})



// render index page
app.get('/index', checkNotAuthenticated, async (req, res) => {
    const checkRole = req.user.role
    // console.log(checkRole)

    if(checkRole == 'admin'){
        try {
            const getAllProduct = await pool.query('SELECT * FROM products')
            res.render('index', {
            title: 'Dashboard page',
            layout: './layouts/main_layouts',
            products: getAllProduct.rows,
            success_message: req.flash('success_message'),
            failed_message: req.flash('fail_message')
        });
    } catch (error) {
        console.log(error.message)
    }
    } else {
        res.redirect('/')
    }
})


// render product list page
app.get('/product_list', checkNotAuthenticated, async (req, res) => {
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
app.get('/add_product', checkNotAuthenticated, (req, res) => {

    res.render('add_product', {
        title: 'add product',
        layout: './layouts/main_layouts'
    });
})
// process add product
app.post('/product/addproduct', checkNotAuthenticated, upload.single('product_image'), async (req, res) => {
    try {
        // res.send('image uploaded')
        const { productName, description, price } = req.body
        const product_image = req.file.path.replace(/\\/g, '/')
        // console.log(product_image)
        await pool.query(`INSERT INTO products (product_name, description, product_image, price) VALUES ('${productName}', '${description}', '${product_image}', '${price}') RETURNING *`)
        req.flash('success_message', 'New product has been added')
        res.redirect('/index')
    } catch (error) {
        console.error(error.message)
    }
})


// render detail product page
app.get('/product/detail_product/:product_id', checkNotAuthenticated, async (req, res) => {
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
app.get('/product/update_product/:product_id', checkNotAuthenticated, upload.single('product_image'), async (req, res) => {
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
app.post('/product/update_product', checkNotAuthenticated, upload.single('new_product_image'), async (req, res) => {
    try {
        let { product_id, product_name, price, description, old_product_image } = req.body
        
        if (!req.file) {
            await pool.query(`UPDATE products SET product_name = '${product_name}', price = '${price}', description = '${description}', product_image = '${old_product_image}' WHERE product_id = '${product_id}' `)
            req.flash('success_message', 'Product has beens updated')
            res.redirect('/index')
        } else {
            const new_product_image = req.file.path.replace(/\\/g, '/')
            await pool.query(`UPDATE products SET product_name = '${product_name}', price = '${price}', description = '${description}', product_image = '${new_product_image}' WHERE product_id = '${product_id}' `)
            req.flash('success_message', 'Product has been updated')
            res.redirect('/index')
        }

    } catch (error) {
        console.error(error.message)
    }
})
// process delete product
app.get('/product/delete_product/:product_id', checkNotAuthenticated, async (req, res) => {
    try {
        // cek nama jika ada
        const checkProductId = await pool.query(`SELECT product_id FROM products WHERE product_id = '${req.params.product_id}'`)
        if (checkProductId.rowCount == 0) {
            res.redirect('/index')
        } else {
            req.flash('failed_message', 'Fail to delete product')
            await pool.query(`DELETE FROM products WHERE product_id = '${req.params.product_id}'`)
            res.redirect('/index')
        }
    } catch (error) {
        console.error(error.message)
    }
})


// render selling list page
app.get('/selling_list', checkNotAuthenticated, async (req, res) => {

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

    // console.log(selling_list_result)

    res.render('selling_list', {
        title: 'selling list',
        layout: './layouts/main_layouts',
        selling: selling_list_result,
        success_message: req.flash('success_message'),
        failed_message: req.flash('fail_message')
    });

})

app.get('/selling_list/:product_id', checkNotAuthenticated, async (req, res) => {
    
    try {
        const params_product_id = req.params.product_id
        const params_user_id = req.user.user_id
    
        // get current date data
        var timestamp = new Date();
        var dd = String(timestamp.getDate()).padStart(2, '0');
        var mm = String(timestamp.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = timestamp.getFullYear();
        timestamp = mm + '/' + dd + '/' + yyyy;

        await pool.query(`INSERT INTO selling (product_id, user_id, date) VALUES ('${params_product_id}', '${params_user_id}', '${timestamp}') RETURNING *`)
        req.flash('success_message', 'New Product has been added')
        res.redirect('/selling_list')
    } catch (error) {
        console.error(error.message)
    }

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
    

app.use('/', (req, res) => {
    // set status code to 404
    res.status(404)
    res.send('Error 404: Page not found')
})

}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})