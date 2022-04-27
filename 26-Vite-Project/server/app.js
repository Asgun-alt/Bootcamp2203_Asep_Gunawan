const pool = require('../db')
const express = require('express')
const app = express()
const port = 3001
const cors = require('cors')

app.use(cors())
app.use(express.json())


// R O U T E S \\
// get all contact from database
app.get('/contacts', async (req, res) => {
    try {
        const getAllContact = await pool.query('SELECT * FROM contacts')
        // console.log(getAllContact.rows)
        res.json(getAllContact.rows)
    } catch (error) {
        console.error(error.message)
    }
})
// get a contact from database
app.get('/contact/:id', async (req, res) => {
    try {
        const { id } = req.params
        const getContact = await pool.query(`SELECT * FROM contacts WHERE name = '${id}' `)
        res.json(getContact.rows)
    } catch (error) {
        console.error(error.message)
    }
})
// delete contact
app.delete('/contact/delete/:id', async (req, res) => {
    try {
        const { id } = req.params
        await pool.query(`DELETE FROM contacts WHERE id = '${id}' `)
        res.json('Contact has been DELETED!')
    } catch (error) {
        console.error(error.message)
    }
})
// create contact
app.post('/contact', async (req, res) => {
    try {
        const { name, email, mobile } = req.body
        const newContact = await pool.query(`INSERT INTO contacts (name, email, mobile) VALUES ('${name}', '${email}', '${mobile}') RETURNING * `)

        res.json(newContact.rows)
    } catch (error) {
        console.error(error.message)
    }
})
// update contact
app.put('/contact/:id', async (req, res) => {
    try {
        const { updateName, updateEmail, updateMobile } = req.body

        await pool.query(`UPDATE contacts SET name = '${updateName}', email = '${updateEmail}', mobile = '${updateMobile}' WHERE id = '${req.params.id}' `)

        res.json('Contact has been Updated!')
    } catch (error) {
        console.error(error.message)
    }
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})