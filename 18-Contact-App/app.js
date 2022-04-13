const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000

const { checkedData } = require('./functions.js')

// initialize express validator
const { body, check, validationResult } = require('express-validator')

// initialize database and get functions
const pool = require('./db')

// initialize flash message session
var flash = require('express-flash')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var sessionStore = new session.MemoryStore;


// configure flash message
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    saveUninitialized: 'true'
}))
app.use(flash())

// custom flash middleware
app.use((req, res, next) => {
    res.locals.sessionFlash = req.sessionFlash
    delete req.session.sessionFlash
    next()
})

// Information using EJS
app.set('view engine', 'ejs')
//serve static file 
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(expressLayouts);
app.set('layout', './layout/main_layouts')

app.get('/', (req, res) => {

    res.render('index', {
        title: 'home page'
    });
})

// render about page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'about me'
    });
})

// render contact page
app.get('/contact', async (req, res) => {
    try {
        const getAll = await pool.query('SELECT * FROM contacts')
        res.render('contact', {
            title: 'contact page',
            contacts: getAll.rows,
            message: req.flash('message'),
            delete_message: req.flash('delete_message')
        });
    } catch (error) {
        console.error(error.message)
    }
})

// delete contact process
app.get('/contact/delete/:name', async (req, res) => {
    try {
        // cek nama jika ada
        const checkName = await pool.query(`SELECT name FROM contacts WHERE name = '${req.params.name}'`)
        if (checkName.rowCount == 0) {
            req.flash('delete_message', `contact is not found`)
            res.redirect('/contact')
        } else {
            await pool.query(`DELETE FROM contacts WHERE name = '${req.params.name}'`)
            req.flash('delete_message', 'data has been deleted')
            res.redirect('/contact')
        }
    } catch (error) {
        console.error(error.message)
    }
})

// checkbox delete process
app.post('/contact/checkDelete', (req, res) => {
    const { checkboxDelete } = req.body

    if (Array.isArray(checkboxDelete)) {
        checkboxDelete.forEach(checkboxContact => {
            // panggil fungsi untuk menghapus data yang ditaindai
            checkedData(checkboxContact)
            req.flash('delete_message', 'data has been deleted')
            res.redirect('/contact')
        })
    } else {
        req.flash('delete_message', 'data has been deleted')
        res.redirect('/contact')
    }
})

// edit contact
app.get('/contact/edit/:name', async (req, res) => {
    try {
        const paramsName = req.params.name
        const { rows: getDetail } = await pool.query(`SELECT * FROM contacts WHERE name = '${paramsName}'`)
        // fungsi map ini digunakan untuk mengolah setiap element di array/pbjek dan kemudian menghasilkan array/objek baru
        // biasanya digunakan dalam bentuk perulangan
        getDetail.map(contactDetail => {
            res.render('edit-contact', {
                title: 'form edit contact',
                getDetail,
                contactDetail
            })
        })

    } catch (error) {
        console.error(error.message)
    }
})

// process update data contact 
app.post('/contact/update', [
    body('name').custom(async (value, { req }) => {
        const duplicate = await pool.query(`SELECT name FROM contacts WHERE name = '${value}'`)
        // console.log(value)
        // console.log(duplicate.rows)
        if (value === req.body.oldName) {
            return true
        } else if (duplicate.rowCount > 0) {
            throw new Error('name is already used!')
        } else {
            return true
        }
    }),
    check('email', 'email format is not valid!').isEmail(),
    check('mobile', 'phone number format is not valid!').isMobilePhone(),
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // req.flash('delete_message', 'fail to update data')
        res.render('edit-contact', {
            title: 'form edit contact',
            contactDetail: req.body,
            errors: errors.array()
        })
    } else {
        try {
            const { oldName, name, mobile, email } = req.body
            await pool.query(`UPDATE contacts SET name = '${name}', mobile = '${mobile}', email = '${email}' WHERE name = '${oldName}'`)
            req.flash('message', 'contact has been updated')
            res.redirect('/contact')
        } catch (error) {
            console.error(error.message)
        }
    }
})


// detail contact page
app.get('/contact/detail-contact/:name', async (req, res) => {
    try {
        const paramsName = req.params.name
        const { rows: getDetail } = await pool.query(`SELECT * FROM contacts WHERE name = '${paramsName}'`)
        // fungsi map ini digunakan untuk mengolah setiap element di array/objek dan kemudian menghasilkan array/objek baru
        // biasanya digunakan dalam bentuk perulangan
        getDetail.map(contactDetail => {
            res.render('detail-contact', {
                title: 'detail contact',
                getDetail,
                contactDetail
            })
        })

    } catch (error) {
        console.error(error.message)
    }
})

// add contact page
app.get('/contact/add-contact', (req, res) => {
    res.render('add-contact', {
        title: 'add contact'
    });
})

// add contact process
app.post('/contact/addcontact', [
    body('name').custom(async (value) => {
        const duplicate = await pool.query(`SELECT name FROM contacts WHERE name = '${value}'`)
        // console.log(value)
        // console.log(duplicate.rows)
        if (duplicate.rowCount > 0) {
            throw new Error('name is already used!')
        } else {
            return true
        }
    }),
    check('email', 'email format is not valid!').isEmail(),
    check('mobile', 'phone number format is not valid!').isMobilePhone(),
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('add-contact', {
            title: 'add contact',
            errors: errors.array()
        })
    } else {

        try {
            const { name, mobile, email } = req.body
            await pool.query(`INSERT INTO contacts VALUES
            ('${name}', '${mobile}', '${email}') RETURNING *`)

            req.flash('message', 'new data has been added')
            res.redirect('/contact')
        } catch (error) {
            console.error(error.message)
        }

    }
})

app.use('/', (req, res) => {
    // set status code to 404
    res.status(404)
    res.send('Error 404: Page not found')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})