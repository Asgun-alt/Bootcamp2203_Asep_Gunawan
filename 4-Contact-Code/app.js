// const fs = require('fs');
// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// const dirPath = './data';
// if (!fs.existsSync('dirPath')) {
//     fs.mkdirSync(dirPath);
// }
// const dataPath = './data/contacts.json';
// if (!fs.existsSync(dataPath)) {
//     fs.writeFileSync(dataPath, '[]', 'utf-8')
// }


// const questions = (ask) => {
//     return new Promise((resolve, reject) => rl.question(ask, (inputVariable) => {
//         resolve(inputVariable)
//     }))
// }

// const main = async () => {
//     const name = await questions('What is your name: ');
//     const mobile = await questions('Your phone number: ');
//     const email = await questions('What is your email: ')

//     const contact = { name, mobile, email };

//     const file = fs.readFileSync('data/contacts.json', 'utf8');
//     const contacts = JSON.parse(file);
//     contacts.push(contact);
//     fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
//     console.log('Data is saved');
//     rl.close();
// }

// main()

/* rl.question('What is your name: ', (name) => {
    rl.question('What is your phone number: ', (mobile) => {
        const contact = { name, mobile };

        const dirPath = './data';
        if (!fs.existsSync('dirPath')) {
            fs.mkdirSync(dirPath);
        }
        const dataPath = './data/contacts.json';
        if (!fs.existsSync(dataPath)) {
            fs.writeFileSync(dataPath, '[]', 'utf-8')
        }

        const file = fs.readFileSync('data/contacts.json', 'utf8');
        const contacts = JSON.parse(file);
        contacts.push(contact);
        fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
        console.log('Data is saved');
        rl.close();
    });
}); */

const contacts = require('./contacts.js');

const main = async () => {
    const name = await contacts.questions('What is your name: ');
    const email = await contacts.questions('What is your email: ');
    const mobile = await contacts.questions('What is your mobile: ');

    contacts.saveContact(name, email, mobile);
};
main()