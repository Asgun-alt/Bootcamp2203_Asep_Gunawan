// call express module
const express = require('express')
// call express library
const app = express()
//call database
const pool = require('./db')
const port = 3000
app.use(express.json()) // => req.body


// ROUTES
app.get('/addasync', async (req, res) => {
    try {
        const name = "satria"
        const mobile = "081382142884"
        const email = "satria@gmail.com"
        const newContact = await pool.query(`INSERT INTO contacts VALUES
        ('${name}', '${mobile}', '${email}') RETURNING *`)
        res.json(newContact)
    } catch (error) {
        console.error(error.message)
    }
})

// get all contact
app.get('/list', async (req, res) => {
    try {
        const contactList = await pool.query('SELECT * FROM contacts')
        res.json(contactList.rows)
    } catch (error) {
        console.error(error.message)
    }
})

// get a specific contact 
app.get('/contact/:name', async (req, res) => {
    try {
        const contact = req.params.name
        const contactDetail = await pool.query(`SELECT * FROM contacts WHERE name = '${contact}'`)
        res.json(contactDetail.rows)
    } catch (error) {
        console.error(error.message)
    }
})

// call server
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})