const validator = require('validator');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function waitForInputName() {
    rl.question("Enter your name: ", (nameAnswer) => {
        waitForUserInputNumber();

        function waitForUserInputNumber() {
            validator.isMobilePhone, rl.question("Enter your phone number: ", (number) => {
                if (!validator.isMobilePhone(number)) {
                    console.log("Try again");
                    waitForUserInputNumber();
                } else {
                    waitForUserInputEmail()
                }
                function waitForUserInputEmail() {
                    validator.isEmail, rl.question("Enter your email: ", (emailAnswer) => {
                        if (!validator.isEmail(emailAnswer)) {
                            console.log("Try again");
                            waitForUserInputEmail();
                        } else {
                            console.log(`Your Name ${nameAnswer}, Your phone number, ${number} Your email address is ${emailAnswer}`);
                            rl.close();
                        }
                    })
                }
            });
        }
    })
}
waitForInputName();