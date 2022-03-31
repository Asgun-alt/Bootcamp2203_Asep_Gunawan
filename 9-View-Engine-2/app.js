const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
const app = express()
const port = 3000

// function to show author's name to ejs file
const author = {
    name: "Asep gunawan",
    title: "web server EJS"
}

// Information using EJS
app.set('view engine', 'ejs')

app.use(expressLayouts);
app.set('layout', './layout/main_layouts')

// app.get('/', function (req, res) {
//     res.locals = {
//         title: 'Example',
//         message: 'This is a message'
//     };
//     res.render('index', {
//         // additional locals, a custom layout, or other options can be defined here
//     });
// });

app.get('/', (req, res) => {
    res.locals.title_page = "index"
    res.render('index');
})

app.get('/about', (req, res) => {
    res.locals.title_page = "about"
    res.render('about');
})

app.get('/contact', (req, res) => {
    res.locals.title_page = "contact"
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