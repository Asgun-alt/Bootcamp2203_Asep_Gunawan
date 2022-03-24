const validator = require('validator');
const readline = require('readline');
const { resolve } = require('path');
const { Resolver } = require('dns');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));
(async () => {

    const name = await prompt('What is your name: ')
    var phoneNumber = await prompt('What is your phone number: ')
    if (!validator.isMobilePhone(phoneNumber)) {
        phoneNumber = await prompt('Enter a valid phone number: ')
    }
    var email = await prompt('What is your email address: ')
    if (!validator.isEmail(email)) {
        email = await prompt('Enter a valid email: ')
    }

    console.log(`Welcome ${name}, Your phone number is ${phoneNumber} and your email is ${email}`);
    rl.close()
}
)()

rl.on('close', () => process.exit(0))