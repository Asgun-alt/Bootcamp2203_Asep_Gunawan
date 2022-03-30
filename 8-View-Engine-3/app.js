const express = require('express')
const app = express()
const path = require('path');
const port = 3000

// function to show author's name to ejs file
const author = {
    name: "Asep gunawan",
    title: "Webserver EJS"
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
    res.render('index', { author, contact });
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

// get parameters product and category id 
app.get('/product/:idproduct/category/:idcategory', (req, res) => {
    res.send('Product id: ' + req.params.idproduct +
        '<br> Category id: ' + req.params.idcategory)
})

// get parameter product and query category 
app.get('/shop/:id_product', (req, res) => {
    const id_product = req.params.id_product;
    const id_category = req.query.id_category;

    res.send('product id: ' + id_product +
        '<br>Category id: ' + id_category)
})

app.use('/', (req, res) => {
    // set status code to 404
    res.status(404)
    res.send('Error 404: Page not found')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})