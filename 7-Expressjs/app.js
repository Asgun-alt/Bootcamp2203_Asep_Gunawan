const express = require('express')
const app = express()
const path = require('path');
const port = 3000


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname + '/about.html'))
})

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname + '/contact.html'))
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