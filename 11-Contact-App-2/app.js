const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000
const fs = require('fs')

const { loadContact } = require('./contacts.js')

// load data from json
// const loadContact = () => {
//     const file = fs.readFileSync('./data/contacts.json', 'utf8');
//     const contacts = JSON.parse(file);
//     return contacts;
// }

// function to show author's name to ejs file
const author = {
    name: "Asep gunawan",
    title: "web server EJS"
}

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

app.get('/about', (req, res) => {
    res.locals.title_page = "About"
    res.render('about');
})

app.get('/contact', (req, res) => {
    res.locals.title_page = "Contact" 
    res.render('contact');
})

app.use('/', (req, res) => {
    // set status code to 404
    res.status(404)
    res.send('Error 404: Page not found')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})