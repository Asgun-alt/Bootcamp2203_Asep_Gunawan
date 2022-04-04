const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000

contact = require('./data/contacts.json')

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
    res.render('index');
})

app.get('/about', (req, res) => {
    res.locals.title_page = "About"
    res.render('about');
})

app.get('/contact', (req, res) => {
    res.locals.title_page = "Contact"
    res.render('contact', {
        contact
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