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
app.get('/detail_contact/:name', async (req, res) => {
    try {
        const contact = req.params.name
        const contactDetail = await pool.query(`SELECT * FROM contacts WHERE name = '${contact}'`)
        res.json(contactDetail.rows)
    } catch (error) {
        console.error(error.message)
    }
})

// update contact
app.get('/update_contact/:name', async (req, res) => {
    try {
        const oldName = req.params.name
        const newName = 'albert'
        const newMobile = '081394821941'
        const newEmail = 'albert@gmail.com'
        const contactUpdate = await pool.query(`UPDATE contacts SET name = '${newName}', mobile = '${newMobile}', email = '${newEmail}' WHERE name = '${oldName}'`)
        res.redirect('/list')
    } catch (error) {
        console.error(error.message)
    }
})

// delete a specific contact
app.get('/delete_contact/:name', async (req, res) => {
    try {
        // validate name if not exist
        const checkName = await pool.query(`SELECT name FROM contacts WHERE name = '${req.params.name}'`)
        if (checkName.rowCount == 0) {
            res.send(`'${req.params.name} is not found'`)
        } else {
            const contactDelete = await pool.query(`DELETE FROM contacts WHERE name = '${req.params.name}'`)
            res.redirect('/list')
        }
        // res.json(`Contact ${contact} has been deleted`)
        // res.json(contactDelete.rows)
    } catch (error) {
        console.error(error.message)
    }
})

// call server
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})