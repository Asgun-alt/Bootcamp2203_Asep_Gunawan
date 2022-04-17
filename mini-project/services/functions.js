const fs = require('fs');
const pool = require('../db');
const fileUpload = require('express-fileupload')

async function addProduct(value) {
    try {

    } catch (error) {
        console.error(error.message)
    }
}

async function getAllProduct() {

    await pool.query('SELECT * FROM products')

}

// async function addProduct(value) {
//     try {
//         await pool.query(`DELETE FROM contacts WHERE name = '${value}'`)
//     } catch (error) {
//         console.error(error.message)
//     }
// }


module.exports = { getAllProduct }