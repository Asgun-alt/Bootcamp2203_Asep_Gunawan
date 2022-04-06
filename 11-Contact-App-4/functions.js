const fs = require('fs');

const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.writeFileSync(dirPath)
}
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

// write contacts json file with new data
const saveContact = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
}

// add new data contact
const addContact = (contact) => {
    const contacts = loadContact()

    contacts.push(contact)
    saveContact(contacts)
}

// load contact from json file
const loadContact = () => {
    const file = fs.readFileSync('./data/contacts.json', 'utf8');
    const contacts = JSON.parse(file);
    return contacts;
}

// get all contact from json file
const listContact = () => {
    const contacts = loadContact();
    console.log('Contact List: ');
    contacts.forEach((contact, i) => {
        console.log(`${i + 1}. ${contact.name} - ${contact.mobile}`);
    });
};

// show contact detail 
const detailContact = (name) => {
    const contacts = loadContact();
    const detail = contacts.find((detail) => detail.name === name)
    return detail;
}

// check duplicate name in contacts json file
const checkDuplicate = (name) => {
    const contacts = loadContact()

    return contacts.find((contact) => contact.name === name)
}

const deleteContact = (name) => {
    const contacts = loadContact()
    contactName = { name }
    const deleteInformation = contacts.filter((contactName) => contactName.name.toLowerCase() !== name.toLowerCase())
    if (contacts.length === deleteInformation.length) {
        console.log('Data is not found');
        return false
    } $
    fs.writeFileSync('data/contacts.json', JSON.stringify(deleteInformation));
    console.log(`${name} Data has been deleted`)
}

module.exports = { addContact, checkDuplicate, listContact, detailContact, deleteContact, loadContact }