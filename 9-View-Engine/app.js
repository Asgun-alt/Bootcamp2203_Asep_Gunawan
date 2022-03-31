const express = require('express')
const app = express()
const port = 3000;

// function to show author's name to ejs file
const author = {
    name: "Asep gunawan",
    title: "web server EJS"
}

// Information using EJS
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    contact = [
        {
            name: "Asep Gunawan",
            email: "asgun@gmail.com"
        },
        {
            name: "Albert",
            email: "albert@gmail.com"
        },
        {
            name: "Boby",
            email: "Boby@gmail.com"
        }
    ]
    res.locals.title_page = "index"
    res.render('index', { author });
})

app.get('/about', (req, res) => {
    res.locals.title_page = "about"
    res.render('about', { author });
})

app.get('/contact', (req, res) => {
    res.locals.title_page = "contact"
    res.render('contact', { author });
})

app.use('/', (req, res) => {
    // set status code to 404
    res.status(404)
    res.send('Error 404: Page not found')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})