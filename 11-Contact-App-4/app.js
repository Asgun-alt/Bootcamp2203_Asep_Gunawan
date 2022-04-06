const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000
const { loadContact, detailContact, addContact, checkDuplicate } = require('./functions.js')

// initialize express validator
const { body, check, validationResult } = require('express-validator')

// initialize flash message session


// Information using EJS
app.set('view engine', 'ejs')
//serve static file 
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(expressLayouts);
app.set('layout', './layout/main_layouts')

app.get('/', (req, res) => {

    res.locals.title_page = "Home"
    const contacts = loadContact()
    res.render('index', {
        title: 'home page',
        contacts,

    });
})

// detail contact page
app.get('/detail-contact/:name', (req, res) => {
    const contacts = detailContact(req.params.name)
    res.render('detail-contact', {
        title: 'detail contact',
        contacts
    });
})

// add contact page
app.get('/add-contact', (req, res) => {
    res.render('add-contact', {
        title: 'add contact'
    });
})

// process add contact 
app.post('/', [
    body('name').custom((value) => {
        const duplicate = checkDuplicate(value)
        if (duplicate) {
            throw new Error('name is already used!')
        } else {
            return true
        }
    }),
    check('email', 'email format is not valid!').isEmail(),
    check('phoneNumber', 'phone number format is not valid!').isMobilePhone(),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        res.render('add-contact', {
            title: 'add contact',
            errors: errors.array()
        })
    } else {
        addContact(req.body)
        res.redirect('/')
    }

})

// render about page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'about me'
    });
})

// render contact page
app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'contact page'
    });
})

app.use('/', (req, res) => {
    // set status code to 404
    res.status(404)
    res.send('Error 404: Page not found')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})