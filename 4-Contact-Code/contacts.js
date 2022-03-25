const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const dirPath = './data';
if (!fs.existsSync('dirPath')) {
    fs.mkdirSync(dirPath);
}
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

    const file = fs.readFileSync('data/contacts.json', 'utf8');
    const contacts = JSON.parse(file);
    contacts.push(contact);
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
    console.log('Data is saved');
    rl.close();
}

module.exports = { questions, saveContact }
// module.exports.saveContact = saveContact