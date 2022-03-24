/* const fs = require('fs');

fs.readFile('test.txt', 'utf-8', (err, Data) => {
    if (err) throw err;
    console.log(Data);
}); */

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('What is your name? ', (nama) => {
    rl.question('Your mobile number? ', (number) => {
        rl.question('What is your email? ', (email) => {
            console.log(`Your name is ${nama}, Your mobile number ${number}, Your email is ${email}`)
            rl.close();
        });
    });
});