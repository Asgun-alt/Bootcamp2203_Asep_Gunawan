const fs = require('fs');
const validator = require('validator');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// const dirPath = './data';
// if (!fs.existsSync('dirPath')) {
//     fs.mkdirSync(dirPath);
// }
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

const questions = (ask) => {
    return new Promise((resolve, reject) => rl.question(ask, (inputVariable) => {
        resolve(inputVariable)
    }))
}
const saveContact = (name, email, mobile) => {

    const contact = { name, mobile, email };

    // to read file 
    const file = fs.readFileSync('data/contacts.json', 'utf8');
    const contacts = JSON.parse(file);

    // to check if the data has been recorded before
    const duplicateName = contacts.find((contact) => contact.name === name);

    //check if there is duplicate name
    if (duplicateName) {
        console.log('Contact name is already recorded, Use another contact name.');
        return false;
    }

    // validate email format, also check if there is duplicate email 
    if (email) {
        if (!validator.isEmail(email)) {
            console.log('Invalid email.');
            return false;
        }
    }

    // validate mobile phone format, also check if there is duplicate mobile phone 
    if (!validator.isMobilePhone(mobile)) {
        console.log('Invalid phone number.');
        return false;
    }

    // save data to file
    contacts.push(contact);
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
    console.log('Data is saved');

}

module.exports = { saveContact }
// module.exports.saveContact = saveContact