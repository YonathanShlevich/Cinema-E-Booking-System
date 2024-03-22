const express = require('express');
const router = express.Router();

//Mongo User model
const User = require('./../models/User');

//Password hashing
const bcrypt = require('bcrypt');

//Function that pulls inputted 
//Creating an if statement for each attribute is absurdly chunky, instead we will be creating an array
//of each attribute, it's regex pattern, and its error message. Then just run through it with a loop.
//NOTE: Turns out half of the attributes do not need a regex pattern, but we are keeping this and possbily making it a global
//function of some kind for all other checks. 
function generateAttributes(firstName, lastName, email, password) {
    return [
        { name: 'firstName', value: firstName, pattern: /^[a-zA-z]*$/, errMessage: 'Invalid first name entered' },
        { name: 'lastName', value: lastName, pattern: /^[a-zA-z]*$/, errMessage: 'Invalid last name entered' },
        { name: 'email', value: email, pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, errMessage: 'Invalid email entered' },
        { name: 'password', value: password, pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]:;"'<>,.?/|\\~`])[a-zA-Z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?/|\\~`]{8,}$/, errMessage: 'Invalid password entered' },
        //Nothing for userStatus as it is not a user determined attribute
        //Type also isn't determined by the user
        //Promo is a true/false distinction, no need for regex
    ];
}


// Signin API
router.post('/signin', (req, res) => {
    //Login only requires the email and password
    let {email, password} = req.body; 
    //Trimming :)
    email = email.trim();
    password = password.trim();
    //Checking if empty inputs, otherwise we checking if the user exists
    if(!email || !password){
            return res.json({
            status: "FAILED",
            message: 'Empty input fields',
        });
    } else { //Checking if user exists
        User.find({email}).then(data => {
            if(data.length){
                //Comparing passwords
                const hashedPW = data[0].password;
                console.log(data[0].password + " : " + hashedPW);
                bcrypt.compare(password, hashedPW).then(result => {
                    //If the passwords are the same
                    if(result){
                        rse.json({
                            status: "SUCCESS",
                            message: "Signin was successful",
                            data: data
                        })
                    } else { //If they're not the same
                        res.json({
                            status: "FAILED",
                            message: "Invalid password"
                        })

                    }
                }).catch(err => {  //bcrypt catch blovk
                    console.log(result);
                    res.json({
                        status: "FAILED",
                        message: "Error while comparing passwords"
                    })
                })
            } else { //Incorrect creds were entered
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials"
                })
            }
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "Error while checking for existing user"
            })
        });
    }


})

// Signup API
router.post('/signup', (req, res) => {
    //All the attributes of a User
    let {firstName, lastName, email, password, userStatus, type, promo} = req.body;
    userStatus = 2; //Status is 2, meaning it is inactive and requires the email verification 
    type = 1; //1 means customer, 2 means admin
    //TODO: Make the promo code a box that is checked by the user. For now it defaults to false
    promo = false; 

    const attributes = generateAttributes(firstName, lastName, email, password);

    //For loop that ambigiously goes through all attributes' regex pattern
    for(const attribute of attributes){
        attribute.value = attribute.value.trim(); //Trimming all the attributes
        //Checks if an attribute is empty
        if(!attribute.value){
            return res.json({
                status: "FAILED",
                message: 'Empty input fields',
            });
        }
        // Check if the attribute matches the regex pattern
        if (attribute.pattern && !attribute.pattern.test(attribute.value)) {
            return res.json({
                status: 'FAILED',
                message: attribute.errMessage,
            });
        }
    }

    //TODO: Checking if email already exists in the DB
    User.find({email}).then(result => {
        //Checks if the user exists
        if(result.length){
            res.json({
                status: "FAILED",
                message: "A user with this email already exists"
            })
        } else { //Creates the user
            const saltRounds = 10; //Hashing attribute
            bcrypt.hash(password, saltRounds).then(hashedPassword => {
                //This creates a new user with the hashpassword
                const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    userStatus,
                    type,
                    promo
                })

                //This saves the new user with a success message
                newUser.save().then(result => {
                    res.json({
                        status: "SUCCESS",
                        message: "Signup was successful!",
                        data: result
                    })
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while saving the user account"
                    });
                });
            }).catch(err => {
                res.json({
                    status: "FAILED",
                    message: "An error occured while hashing the password"
                });
            });
        }
    }).catch(err => {
        console.log(err);
        res.json({
            status: "FAILED",
            message: "An error occured while checking for existing user"
         });
    });
});

module.exports = router;