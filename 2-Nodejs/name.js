/* var firstName = 'Asep';
var lastName = 'Gunawan';
console.log(firstName, lastName); */

const prompt = require("prompt-sync")();
/* prompt-sycn module is a function to create prompting function for node */

var fullName = prompt('What is your full name? ');
var age = prompt('How old are you? ');
let gender = prompt('What is your gender (m/f)? ')
if (gender == 'm') {
    gender = 'male';
} else if (gender == 'f') {
    gender = 'female'
} else {
    console.log('you have to choose between (m) or (f) only \n')
}

console.log(`\n Your name is ${fullName} ${age} years old ${gender}`);
