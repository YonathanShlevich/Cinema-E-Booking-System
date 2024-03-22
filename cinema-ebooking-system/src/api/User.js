const express = require('express');
const router = express.Router();

//Mongo User model
const User = require('./../models/User');

//Mongo UserStatus model
const UserStatus = require('./../models/UserStatus');

//Email handling import
const nodemailer = require("nodemailer");

//UUID handling
const {v4: uuidv4} = require("uuid"); //The 'v4' is the c4 model within uuid

//Env variables
require("dotenv").config(); //TAKE A SECOND LOOK AT THIS

//Path for the verify page
const path = require("path");

//Nodemailer
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
});

//Testing the mailer + console response
transporter.verify((error, success) => {
    if(error){
        console.log(error);
    } else{
        console.log("Messages being accepted...");
        console.log(success);
    }
});

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
                //Checking if the user is verified
                if(data[0].status != 1){ 
                    res.json({
                        status: "FAILED",
                        message: "Email has not yet been verified, check your email inbox"
                    });
                } else {
                    //Comparing passwords
                    const hashedPW = data[0].password;
                    //Debugging passwords: console.log(data[0].password + " : " + hashedPW);
                    //Compared the hashed passwords
                    bcrypt.compare(password, hashedPW, (err, result) => {
                        if(err){ //Error in comparison
                            res.json({
                                status: "FAILED",
                                message: "Error while comparing passwords"
                            })
                        }
                        if(!result) { //Incorrect password
                            res.json({
                                status: "FAILED",
                                message: "Invalid password"
                            })
                        }
                        res.json({
                            status: "SUCCESS",
                            message: "Signin was successful",
                            data: data
                        })                   
                    })                   
                } 
                
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
                    userStatus: 2,
                    type,
                    promo
                })

                //This saves the new user with a success message
                newUser.save().then(result => {
                    // res.json({
                    //     status: "SUCCESS",
                    //     message: "Signup was successful!",
                    // });
                    sendVerificationEmail(result, res); //Send the verification email
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

//Send email type beat
const sendVerificationEmail = ({_id, email}, res) => {
    //URL for the email, in our case currently it is localhost:5000
    const currentURL = "http://localhost:5000/";

    const uuidString = uuidv4() + _id;

    //Mail options
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your email!",
        html: `<p>Verify your email address to finish signup and login with your account!</p><p> Press <a href=${currentURL + "user/verify/" + _id +
         "/" + uuidString}>here</a> to proceed.</p>`,
    };

    //Has the uuidString
    const saltRounds = 10;
    bcrypt
    .hash(uuidString, saltRounds)
    .then((hasheduuiString) => {
        //Set the values in UserStatus 
        const newStatus = new UserStatus({
            userId: _id,
            uniqueString: hasheduuiString,
            creationDate: Date.now(),
            expiresAt: Date.now() + 21600000 //This is 6 hours
        });
        //Saving the UserStatus Model
        newStatus
            .save()
            .then(() => {
                transporter.sendMail(mailOptions).then(() => { //Sending the verifitcation email
                    //Email has been sent
                    res.json({
                        status: "PENDING",
                        message: "Verification email sent"
                    })
                }).catch((err) => {
                    console.log(err);
                    res.json({
                        status: "FAILED",
                        message: "Verification email failed to send"
                    });
                });
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    status: "FAILED",
                    message: "Failed to save userStatus email data"
                });
            });
    })
    .catch(() => {
        res.json({
        status: "FAILED",
        message: "An error occured while hashing the email data"
        });
    });
}


//Verify email
router.get("/verify/:userID/:uniqueString", (req, res) => {
    let {userId, uniqueString} = req.params;

    //Does the verification record exist?
    UserStatus
        .find({userId})
        .then((result) => {
            if (result.length > 0){ //Record exists
                //Checking if the email has expired
                const {expiresAt} = result[0]; 

                //Checking the hashuuid for security
                const hashedUniqueString = result[0].uniqueString;
                if(expiresAt < Date.now()){ //If expiresAt is less than current time, not valid
                    UserStatus
                        .deleteOne({userId})
                        .then(result => {
                            User
                                .deleteOne({ _id: userId}) //Once the verification record expires, delete the user
                                .then(() => {
                                    //Record was deleted
                                    //Message should be that the link has expired and they'll need to sign up again
                                    //MORE BLASTED ROUTING
                                })
                                .catch(err => {
                                    console.log(err);
                                    //MORE DAMNED ROUTING ARGH!!
                                }) 
                        })
                        .catch((err) => {
                            console.log(err);
                            //Same routing stuff as earlier (later technically? Look at the last catch in this function)
                        })
                } else { //If there is a valid record, so validate!
                    //Compare the hashed string to the db
                    bcrypt
                    .compare(uniqueString, hashedUniqueString, (err, result) =>{
                        if(err){
                            //Damn routing again... You front enders better make a verification page
                        }
                        if(!result){ //If the strings don't match
                            //Routing, man...
                        }
                        //If the strings match

                        User
                            .updateOne({_id: userId}, {status: 1})
                            .then(() =>{
                                UserStatus
                                .deleteOne({userId})
                                .then(() => {
                                    //Okay this time the routing is good. Just send it to the verified page (I think?) I will link the stuff I'm following
                                    // in the discord
                                })
                                .catch(err => {
                                    //Okay so the routing stuff goes like this:
                                    // There is an html page that needs to take in a message from these routing commands and takes the message as an input
                                    // That's it. It all goes on one page, I just don't have the will or the knowledge to do this with
                                    // any level of effiency. Please.
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                //ARG THIS ROUTING FUUUUUUUUUU
                            })

                    })

                }

            } else { //Record doesn't exist
                //Paste same thing here as in the catch block below for routing
            }
        })
        .catch((err) => {
            console.log(err);
            //MAKE THIS A ROUTE TO AN HTML PAGE THAT SAYS THERE'S AN ERROR IN CHECKING VERIFICATION RECORD
            let message = "An error occured when checking for existing user verification record";
            res.redirect(`/user/verified/error=true&message=${message}`);
        })
});

//Verify path route
router.get("/verified", (req, res) => {
    
})


module.exports = router;