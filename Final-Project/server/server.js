const fs = require('fs');
const pool = require('./db')
const path = require('path')
const passport = require('passport')
const bodyParser = require('body-parser')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const { PORT, CLIENT_URL } = require('./constant')


// import passport middleware
require('../server/middlewares/passport-middleware')

// initialize multer
// determines where the image is stored
const fileImageStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        // the first argument is any erros that occurs, pass null
        callback(null, 'public/product_images')
    },
    // differentiate each files name so it'll be unique 
    filename: (req, file, callback) => {
        callback(null, Date.now() + '_' + file.originalname)
    }
})
const upload_product_image = multer({ storage: fileImageStorage })
// determines where the user image is stored
const fileUserImageStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        // the first argument is any erros that occurs, pass null
        callback(null, 'public/user_images')
    },
    // differentiate each files name so it'll be unique 
    filename: (req, file, callback) => {
        callback(null, path.parse(file.originalname).name + Date.now() + '_' + file.originalname + path.extname(file.originalname))
    }
})
const upload_user_image = multer({ storage: fileUserImageStorage })


//serve static file 
app.use(express.static('public'))
app.use('/public/', express.static('./public'))
// middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())

// middleware logger with morgan
var logStream = fs.createWriteStream(path.join(__dirname, 'access_log.log'), { flags: 'a' })
app.use(morgan(':method :url :status :remote-user :date', { stream: logStream }))



// import route
const authRoutes = require('./routes/auth-route')

// USER ROUTES \\
app.use('/api', authRoutes)

// get all users
app.get('/users', async (req, res) => {
    try {
        const getAllUser = await pool.query('SELECT * FROM users')
        res.json(getAllUser.rows)
    } catch (error) {
        console.error(error.message)
    }
})

// get user by id
app.get('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId
        const getUser = await pool.query(`SELECT * FROM users WHERE user_id = '${userId}' `)
        res.json(getUser.rows)
    } catch (error) {
        console.error(error.message)
    }
})

// update user
app.put('/user/:userId', upload_user_image.single('save_productImage'), async (req, res) => {
    try {
        const userId = req.params.userId

        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        const role = req.body.role
        const fetchFile = req.file.path.replace(/\\/g, '/')

        console.log(username + email + password + role + fetchFile)

        if (!fetchFile) {
            await pool.query(`UPDATE users SET username = '${username}', email = '${email}', password = '${password}', role = '${role}' WHERE user_id = '${userId}' `)
        } else {
            await pool.query(`UPDATE users SET username = '${username}', email = '${email}', password = '${password}', role = '${role}', user_image = '${fetchFile}' WHERE user_id = '${userId}' `)
        }

    } catch (error) {
        console.error(error.message)
    }
})

// delete user
app.delete('/user/delete/:userId', async (req, res) => {
    try {
        const userId = req.params.userId
        await pool.query(`DELETE FROM users WHERE user_id = '${userId}' `)

        const getImage = await pool.query(`SELECT user_image FROM users WHERE user_id = '${userId}' `)
        const imagePath = JSON.stringify(getImage.rows[0].user_image)
        const getPath = imagePath.replace(/"([^"]+(?="))"/g, '$1')
        fs.unlinkSync(getPath);

        res.json('User has been DELETED!')
    } catch (error) {
        console.error(error.message)
    }
})


// get all products
app.get('/get_products', async (req, res) => {
    try {
        const getAllProducts = await pool.query('SELECT * FROM products')
        res.json(getAllProducts.rows)
    } catch (error) {
        console.error(error.message)
    }
})

// get product
app.get('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId
        const getProduct = await pool.query(`SELECT * FROM products WHERE product_id = '${productId}' `)
        res.json(getProduct.rows)
    } catch (error) {
        console.error(error.message)
    }
})

// update product
app.put('/product/:productId', upload_product_image.single('save_productImage'), async (req, res) => {
    try {
        const productId = req.params.productId

        const fetchProductName = req.body.productName
        const fetchDescription = req.body.description
        const fetchPrice = req.body.price
        const fetchFile = req.file.path.replace(/\\/g, '/')

        if (!fetchFile) {
            await pool.query(`UPDATE products SET product_name = '${fetchProductName}', description = '${fetchDescription}', price = '${fetchPrice}' WHERE product_id = '${productId}' `)
        } else {
            await pool.query(`UPDATE products SET product_name = '${fetchProductName}', description = '${fetchDescription}', price = '${fetchPrice}', product_image = '${fetchFile}' WHERE product_id = '${productId}' `)
        }

    } catch (error) {
        console.error(error.message)
    }
})


// delete product
app.delete('/product/delete/:productId', async (req, res) => {
    try {
        const productId = req.params.productId
        await pool.query(`DELETE FROM products WHERE product_id = '${productId}' `)

        const getImage = await pool.query(`SELECT product_image FROM products WHERE product_id = '${productId}' `)
        const imagePath = JSON.stringify(getImage.rows[0].product_image)
        const getPath = imagePath.replace(/"([^"]+(?="))"/g, '$1')
        fs.unlinkSync(getPath);

        res.json('User has been DELETED!')
    } catch (error) {
        console.error(error.message)
    }
})

// add product
app.post('/product/addproduct', upload_product_image.single('save_productImage'), async (req, res) => {
    try {
        let getFetchData = {
            productName: req.body.productName,
            description: req.body.description,
            price: req.body.price,
            product_image: req.file.path.replace(/\\/g, '/')
        }
        await pool.query(`INSERT INTO products (product_name, description, product_image, price) VALUES ('${getFetchData.productName}', '${getFetchData.description}', '${getFetchData.product_image}', '${getFetchData.price}') RETURNING *`)
    } catch (error) {
        console.error(error.message)
    }
})

// get selling data
app.get('/selling', async (req, res) => {
    try {
        const getSelling = await pool.query(`SELECT * FROM selling `)
        res.json(getSelling.rows)
    } catch (error) {
        console.error(error.message)
    }
})

// save cart
app.post('/save_cart', async (req, res) => {
    try {

        const { product, image, description, price, total, quantity } = req.body
        // get current date data
        // var timestamp = new Date();
        var dd = String(timestamp.getDate()).padStart(2, '0');
        var mm = String(timestamp.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = timestamp.getFullYear();
        var timestamp = mm + '/' + dd + '/' + yyyy;

        await pool.query(`INSERT INTO selling (product, description, price, total, quantity, date, image) 
        VALUES ('${product}', '${description}', '${price}', '${total}', '${quantity}', '${timestamp}', '${image}') RETURNING *`)
    } catch (error) {
        console.error(error.message)
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})