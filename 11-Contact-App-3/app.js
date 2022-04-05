const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000
const fs = require('fs')
const { loadContact, detailContact } = require('./functions.js')

// Information using EJS
app.set('view engine', 'ejs')
//serve static file 
app.use(express.static('public'))

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
app.get('/contact/:name', (req, res) => {
    const contacts = detailContact(req.params.name)
    res.render('contact', {
        title: 'detail contact',
        contacts
    });
})

app.get('/about', (req, res) => {
    res.locals.title_page = "About"
    res.render('about');
})

app.use('/', (req, res) => {
    // set status code to 404
    res.status(404)
    res.send('Error 404: Page not found')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})