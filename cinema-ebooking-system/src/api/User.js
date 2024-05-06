const express = require('express');
const router = express.Router();

//Mongo User model
const User = require('./../models/User');
const homeAddress = require('./../models/homeAddress');
const paymentCard = require('./../models/paymentCard');
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
function generateAttributes(firstName, lastName, email, password, phoneNumber, cardType, expDate, cardNumber, 
    billingAddr, billingCity, billingState, billingZip, homeAddr, homeCity, homeState, homeZip) {
    return [
        { name: 'firstName', value: firstName, pattern: /^[a-zA-z]*$/, errMessage: 'Invalid first name entered', required: true},
        { name: 'lastName', value: lastName, pattern: /^[a-zA-z]*$/, errMessage: 'Invalid last name entered', required: true},
        { name: 'email', value: email, pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, errMessage: 'Invalid email entered',required: true},
        { name: 'password', value: password, pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]:;"'<>,.?/|\\~`])[a-zA-Z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?/|\\~`]{8,}$/, errMessage: 'Invalid password entered', required: true},
        { name: 'phoneNumber', value: phoneNumber, pattern: /^[0-9-]+$/, errMessage: 'Invalid password entered', required: true},

        { name: 'cardType', value: cardType, pattern: /^.{1,}$/, errMessage: 'Invalid cardType', required: false},
        { name: 'expDate', value: expDate, pattern: /^.{1,}$/, errMessage: 'Invalid expDate', required: false},
        { name: 'cardNumber', value: cardNumber, pattern: /^.{10}$/, errMessage: 'Invalid cardNumber', required: false},
        { name: 'billingAddr', value: billingAddr, pattern: /^[1-9][0-9]*[ ]+[a-zA-Z ]+$/, errMessage: 'Invalid billingAddr', required: false},
        { name: 'billingCity', value: billingCity, pattern: /^[a-zA-z ]+$/, errMessage: 'Invalid billingCity', required: false},
        { name: 'billingState', value: billingState, pattern: /^.{1,}$/, errMessage: 'Invalid billingState', required: false},
        { name: 'billingZip', value: billingZip, pattern: /^(?=(?:.{5}|.{9})$)[0-9]*$/, errMessage: 'Invalid billingZip', required: false},
        { name: 'homeAddr', value: homeAddr, pattern: /^[1-9][0-9]*[ ]+[a-zA-Z ]+$/, errMessage: 'Invalid homeAddr', required: false},
        { name: 'homeCity', value: homeCity, pattern: /^[a-zA-z ]+$/, errMessage: 'Invalid homeCity', required: false},
        { name: 'homeState', value: homeState, pattern: /^.{1,}$/, errMessage: 'Invalid homeState', required: false},
        { name: 'homeZip', value: homeZip, pattern: /^(?=(?:.{5}|.{9})$)[0-9]*$/, errMessage: 'Invalid homeZip', required: false},
        //Nothing for userStatus as it is not a user determined attribute
        //Type also isn't determined by the user
        //Promo is a true/false distinction, no need for regex
    ];
}


//Return all users
router.get("/allUsers", (req, res) =>{
    User.find({})
        .then(result => {
            
            if(!result){
                return res.json({
                    status: "FAILED",
                    message: 'Users do not exist'
                });
            }   
            return res.json(result); //This just returns the full json of the items in the User
        }).catch(error =>{
            //console.log(`Error: ${error}`);
            return res.json({
                status: "FAILED",
                message: 'Error with pulling data'
            });
        })
})




//GET function to pull info into View Profile
router.get("/data/:userID", (req, res) =>{
    const userID = req.params.userID; //Pulling userId from the URL parameters
    User.findOne({_id: userID})
        .then(result => {
            if(!result){ //If the userID doesn't exist
                return res.json({
                    status: "FAILED",
                    message: 'User does not exist'
                });
            }   
            return res.json(result); //This just returns the full json of the items in the User
        }).catch(error =>{
            console.log(`Error: ${error}`);
            return res.json({
                status: "FAILED",
                message: 'Error with pulling data'
            });
        })
})


//GET function to pull homeAddress into View Profile
router.get("/data/homeAddr/:userID", (req, res) =>{
    const userID = req.params.userID; //Pulling userId from the URL parameters
    homeAddress.findOne({userId: userID})
        .then(result => {
            if(!result){ //If the userID doesn't exist
                return res.json({
                    status: "FAILED",
                    message: 'Home Address user does not exist'
                });
            }   
            return res.json(result); //This just returns the full json of the items in the User
        }).catch(error =>{
            console.log(`Error: ${error}`);
            return res.json({
                status: "FAILED",
                message: 'Error with pulling data'
            });
        })
})

//GET function to pull homeAddress into View Profile
router.get("/data/paymentCard/:userID", (req, res) =>{
    const userID = req.params.userID; //Pulling userId from the URL parameters

    paymentCard.find({ userId: userID })
    .then(cards => {
        if (cards.length === 0) {
            // No cards found for the given userId
            return res.status(404).json({
                status: "FAILED",
                message: "No cards found for the user"
            });
        }
        // Cards found, return them
        // console.log(cards + typeof cards);
        return res.status(200).json({
            status: "SUCCESS",
            cards: cards
        });
    })
    .catch(error => {
        console.error('Error finding cards:', error);
        return res.status(500).json({
            status: "FAILED",
            message: "Error finding cards"
        });
    });


    /*
    paymentCard.findOne({userId: userID})
        .then(result => {
            if(!result){ //If the userID doesn't exist
                return res.json({
                    status: "FAILED",
                    message: 'Payment card user does not exist'
                });
            } 
            return res.json(result); //This just returns the full json of the items in the User
        }).catch(error =>{
            console.log(`Error: ${error}`);
            return res.json({
                status: "FAILED",
                message: 'Error with pulling data'
            });
        })

        */
})


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
                if(data[0].status == 2){ 
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
                        } else if (!result) { //Incorrect password
                            res.json({
                                status: "FAILED",
                                message: "Invalid password"
                            })
                        } else {
                            res.json({
                            status: "SUCCESS",
                            message: "Signin was successful",
                            data: data
                        })  
                        }
                        
                                         
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
    let {firstName, lastName, email, password, status, type, promo, phoneNumber,  //Non-optional data
        cardType, expDate, cardNumber, billingAddr, billingCity, billingState, billingZip, //Optional billing addr
        homeAddr, homeCity, homeState, homeZip} = req.body; //Optional home addr
    status = 2; //Status is 2, meaning it is inactive and requires the email verification 
    type = 1; //1 means customer, 2 means admin
    promo = promo;
    optionalCounter = 0;
    const attributes = generateAttributes(firstName, lastName, email, password, phoneNumber, cardType, expDate, cardNumber, 
        billingAddr, billingCity, billingState, billingZip, homeAddr, homeCity, homeState, homeZip);
    //For loop that ambigiously goes through all attributes' regex pattern
    for(const attribute of attributes){
        // Only trim string values
        if(typeof attribute.value === 'string'){
            attribute.value = attribute.value.trim(); //Trimming all the attributes
        }
        console.log(attribute.value + " : " + attribute.pattern);
        //Checks if an attribute is empty
        if(!attribute.value){
            if(attribute.required){ //If required
                return res.json({
                    status: "FAILED",
                    message: 'Empty input fields, please enter ' + attribute.name ,
                });
            } else { //If optional
                optionalCounter++;
            }
        } else if (attribute.pattern && !attribute.pattern.test(attribute.value)) {
            return res.json({
                status: 'FAILED',
                message: attribute.errMessage,
            });
        }
    }
    console.log(optionalCounter)
    //Checking if all or no optional values are filled out
    if(optionalCounter != 11 && optionalCounter != 0 ){
        return res.json({
            status: 'FAILED',
            message: "If one optional field is filled, the rest must be filled.",
        });
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
                    phoneNumber,
                    status: 2,
                    type,
                    promo
                })

                //This saves the new user with a success message
                newUser.save().then(result => {
                    //Send verification email
                    if(optionalCounter == 0 ){
                        const newHomeAddress= new homeAddress({
                            userId: result._id,
                            homeCity,
                            homeAddr, 
                            homeState, 
                            homeZip
                        });
                        newHomeAddress.save().then(result => {
                            //Nothing should happen in here
                        }).catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occured while saving the home address"
                            });
                        });
                        
                        //Need to hash the credit card info
                        // TODO: Hash all but last 4 digits in credit card number
                        const lastFourDigits = cardNumber.slice(-4);
                        // Hash everything except the last 4 digits
                        const hashedPortion = bcrypt.hashSync(cardNumber.slice(0, -4), 10); // Adjust the salt rounds as needed
                        // Concatenate the hashed portion with the last 4 digits
                        const hashedCreditCard = hashedPortion + lastFourDigits;
                        //Create new billingAddress since user is good to go
                        const newPaymentCard = new paymentCard({
                            userId: result._id,
                            cardType, 
                            expDate,
                            cardNumber: hashedCreditCard, 
                            billingAddr, 
                            billingCity, 
                            billingState, 
                            billingZip
                        })
                        newPaymentCard.save().then(result => {
                            //Nothing should happen in here
                        }).catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occured while saving the payment card"
                            });
                        });

                    }   
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
}); // /signup

//send the user an email if profile has been updated
const sendProfileUpdatedEmail = async (userId) => {
    //URL for the email, in our case currently it is localhost:4000
    const user =  await User.findOne({ _id: userId });
    // console.log("Attempting to send profile update email");
    // console.log(user);
    
    const currentURL = "http://localhost:4000/";
    if(user) {
        //Mail options
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: user.email,
            subject: "Your profile information has been updated",
            html: `<p>You are receiving this email becuase your profile information has been updated.</p>`,
        };
        transporter.sendMail(mailOptions).then(() => { //Sending the verifitcation email
        //Email has been sent
        
        }).catch((err) => {
            console.log(err);
            
        });
    }
    
    

    
}
//Send email type beat
const sendVerificationEmail = ({_id, email}, res) => {
    //URL for the email, in our case currently it is localhost:4000
    console.log("sendVerEmail email: " + email);
    console.log("sendVerEmail id: " + _id);

    const currentURL = "http://localhost:4000/";

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

router.post("/changePassword/:userId", async (req, res) => {
    try {
        const { userId } = req.params; //Brings in userId
        const { oldPassword, newPassword } = req.body;
        
        // Checking if user exists
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.json({ status: "FAILED", message: "User not found" });
        }

        // Comparing old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.json({ status: "FAILED", message: "Invalid old password" });
        }
        const passwordCheck = { 
            name: 'password', value: newPassword, pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]:;"'<>,.?/|\\~`])[a-zA-Z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?/|\\~`]{8,}$/, errMessage: 'Invalid password entered, must contain upper case, lower case, number, symbol, and be 8+ length', required: true
        }

      // if the password does not meet regex
        if (passwordCheck.pattern && !passwordCheck.pattern.test(passwordCheck.value)) {
            return res.json({
                status: 'FAILED',
                message: passwordCheck.errMessage,
            });
        }

        // Hashing new password
        const saltRounds = 10;
        const newPasswordHashed = await bcrypt.hash(newPassword, saltRounds);

        // Updating password
        await User.findOneAndUpdate({ _id: userId }, { password: newPasswordHashed, status: 2 });

        // Sending email
        await sendVerificationEmail(user, res);

        

        // res.json({ status: "SUCCESS", message: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "FAILED", message: "Internal server error" });
    }
});

//API to update profile within edit profile
router.post("/editProfile/:userId", async (req, res) => {
    let { userId } = req.params;
    let {firstName, lastName, phoneNumber, homeAddr, homeCity, homeState, homeZip, promo} = req.body; //Not all of these will change
    const attributes = [
        { name: 'firstName', value: firstName, pattern: /^[a-zA-z]*$/, errMessage: 'Invalid first name entered', required: true},
        { name: 'lastName', value: lastName, pattern: /^[a-zA-z]*$/, errMessage: 'Invalid last name entered', required: true},
        { name: 'phoneNumber', value: phoneNumber, pattern: /^[0-9-]+$/, errMessage: 'Invalid password entered', required: true},
        { name: 'homeAddr', value: homeAddr, pattern: /^[1-9][0-9]*[ ]+[a-zA-Z ]+$/, errMessage: 'Invalid homeAddr', required: false},
        { name: 'homeCity', value: homeCity, pattern: /^[a-zA-z ]+$/, errMessage: 'Invalid homeCity', required: false},
        { name: 'homeState', value: homeState, pattern: /^.{1,}$/, errMessage: 'Invalid homeState', required: false},
        { name: 'homeZip', value: homeZip, pattern: /^(?=(?:.{5}|.{9})$)[0-9]*$/, errMessage: 'Invalid homeZip', required: false},
        { name: 'promo', value: promo, pattern: /^/, errMessage: 'Promo error', required: true}
    ];
    const userUpdates = {};
    const homeUpdates = {};
    for(const attribute of attributes){
        if(attribute.value && typeof attribute.value === 'string'){
            attribute.value = attribute.value.trim(); //Trimming all the attributes
        } else if (!attribute.value && attribute.name != "promo"){
            continue;
        }
        console.log(attribute.name);
        if(attribute.name == "promo"){
            console.log("In promo");
            const currentPromo = await User.findById({_id: userId}).then((result) => {
                if(result.promo != promo){
                    userUpdates[attribute.name] = attribute.value;
                } 
            })
            .catch((err) => {
                res.json({
                    status: "FAILED",
                    message: "User not found for promo"
                })
            });
        }  //If promo is false and the name is promo
        //Checks if an attribute is empty
        else if(!attribute.value || attribute.value === undefined){
            if(attribute.required){ //If required
                return res.json({
                    status: "FAILED",
                    message: 'Empty input fields, please enter ' + attribute.name ,
                });
            }
        } else if (attribute.pattern && !attribute.pattern.test(attribute.value)) {
            return res.json({
                status: 'FAILED',
                message: attribute.errMessage,
            });
        } 
        if(attribute.name.substring(0, 4) === "home"){ //If it is a "home" attribute from homeAddress
            homeUpdates[attribute.name] = attribute.value;
        } else { //Adding to updates list
            userUpdates[attribute.name] = attribute.value; // Push non-empty attributes into User updates for later
        }
    }
    //Check if there exists a homeAddress and if they want to change their home address
    //  1) If they don't have an HA and don't want to change it, only update User
    //  2) If they don't have an HA and want to change it, create a HA schema 
    //      2.5) Must have all values filled out!
    //  3) If they have an HA and don't want to change it, then only update User
    //  4) If they have an HA and want to change it, update it

    const userFilter = {_id: userId};
    const homeFilter = {userId: userId};

    let userUpdateCount = 0;
    for(const key in userUpdates){
        if(userUpdates[key] === undefined){
            //Nothing
        } else {
            console.log(`Key = ${key} : ${userUpdates[key]}`);
            userUpdateCount++;
        }
    }
    let homeUpdateCount = 0;
    for(const key in homeUpdates){
        if(homeUpdates[key] === undefined){
            //Nothing
        } else {
            console.log(`Key = ${key} : ${homeUpdates[key]}`);
            homeUpdateCount++;
        }
    }
    // 1 & 3) No HA and only updating User
    console.log(userUpdateCount + " :  " + homeUpdateCount);
    if(homeUpdateCount == 0 && userUpdateCount > 0){
        // console.log("1 & 3) No HA and only updating User");
        console.log(homeUpdateCount);
        await User.findOneAndUpdate(userFilter, 
            {$set: userUpdates}, //'$set' stops the command from wiping other fields
            {new: true} //returns updates info
            ).catch((err) => {
            return res.json({
                status: 'FAILED',
                message: "User not found",
            });
        });
        console.log("Done!")
        sendProfileUpdatedEmail(userId);
        return res.json({
            status: "SUCCESSFUL",
            message: "User profile Updated!"
        })
    } 
    //  2 + 4) If they don't have an HA and want to change it, create a HA schema + User updating
    //  2.5) Must have all values filled out!
    else if(homeUpdateCount > 0 && userUpdateCount > 0) {
        //console.log("2 + 4) If they don't have an HA and want to change it, create a HA schema + User updating");
        if (await homeAddress.findOne(homeFilter)){ //If the homeAddress exists
            console.log("If home address exists...");
            await homeAddress.findOneAndUpdate(homeFilter, 
                {$set: homeUpdates},
                {new: true}
                ).catch((error) => {
                    return res.json({
                        status: 'FAILED',
                        message: "homeAddress schema not found",
                    });
                });
            //console.log("Found home address...");
            await User.findOneAndUpdate(userFilter, {$set: userUpdates}, {new: true})
                .catch((error) => {
                    return res.json({
                    status: 'FAILED',
                    message: "homeAddress schema not found",
                });
            });
            //console.log("Done!");
            sendProfileUpdatedEmail(userId);
            return res.json({
                status: "SUCCESSFUL",
                message: "User profile and homeAddress were Updated!"
            });
        } else if (homeUpdateCount == 4){ //If we cannot find a HA and all options are filled out
            //console.log("If home address doesn't exist...");
            const newHomeAddress= new homeAddress({
                userId: userId,
                homeCity: homeCity,
                homeAddr: homeAddr, 
                homeState: homeState, 
                homeZip: homeZip
            });
            await newHomeAddress.save().catch((error) => {
                res.json({
                    status: "FAILED",
                    message: "An error occured while saving the home address"
                });
            })
            await User.findOneAndUpdate(userFilter, {$set: userUpdates}, {new: true})
                .catch((error) => {
                    return res.json({
                    status: 'FAILED',
                    message: "homeAddress schema not found",
                });
            });
            sendProfileUpdatedEmail(userId);
            return res.json({
                status: "SUCCESSFUL",
                message: "User profile was updated and a new homeAddress was created!"
            });
        } else {//If not all fields are filled in for the home address
            return res.json({
                status: 'FAILED',
                message: "Must fill in all fields for a new home address",
            });
        }
    } else {
        return res.json({
            status: 'FAILED',
            message: "Didn't fit possible conditions",
        });
    }
});
    

router.post("/forgetpassword", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Checking if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({ status: "FAILED", message: "User not found" });
        }

        const passwordCheck = { 
            name: 'password', value: password, pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]:;"'<>,.?/|\\~`])[a-zA-Z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?/|\\~`]{8,}$/, errMessage: 'Invalid password entered, must contain upper case, lower case, number, symbol, and be 8+ length', required: true
        }

        // if the password does not meet regex
        if (passwordCheck.pattern && !passwordCheck.pattern.test(passwordCheck.value)) {
            return res.json({
                status: 'FAILED',
                message: passwordCheck.errMessage,
            });
        }

        // Hashing new password
        const saltRounds = 10;
        const newPasswordHashed = await bcrypt.hash(password, saltRounds);

        // Updating password
        await User.findOneAndUpdate({ email }, { password: newPasswordHashed});

        res.json({ status: "SUCCESS", message: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "FAILED", message: "Internal server error" });
    }
});

// Object to store temporary passwords
const temporaryPasswords = {};

// Function to generate and store a temporary password for an email
function generateAndStoreTempPassword(email) {
    const temporaryPassword = Math.random().toString(36).slice(-8);
    temporaryPasswords[email] = temporaryPassword;
}

// Route for sending a temporary password
router.post("/sendTempPassword", async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user
        const result = await User.findOne({ email });

        // Checks if the user exists
        if (result) {
            // Generate a temporary password and store it
            generateAndStoreTempPassword(email);

            // Send email with temporary password
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.AUTH_EMAIL,
                    pass: process.env.AUTH_PASSWORD
                }
            });

            // Mail options
            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: "Temporary Password for Password Reset",
                html: `<p>Your temporary password is: ${temporaryPasswords[email]}</p><p>Please use this temporary password to reset your password.</p>`
            };

            // Send the email
            await transporter.sendMail(mailOptions);
            console.log(temporaryPasswords[email]);

            res.json({ status: "SUCCESS", message: "Temporary Password sent successfully" });
        } else {
            // If the user does not exist
            res.json({
                status: "FAILED",
                message: "There is no user associated with that email"
            });
        }
    } catch (error) {
        console.error("Error sending temporary password:", error);
        res.status(500).json({ status: "FAILED", message: "Temporary Password not sent successfully" });
    }
});


// Route for verifying temporary password
router.post("/verifyTempPassword", async (req, res) => {
    try {
        
        const { email, tempPassword } = req.body;

        // Retrieve the temporary password stored earlier
        const storedTempPassword = temporaryPasswords[email];
        console.log(storedTempPassword);

        // Checking if the temp password the user inputs is the same as the one sent
        if (tempPassword === storedTempPassword) {
            res.json({ status: "SUCCESS", message: "Temporary Password verified successfully" });
        } else {
            res.json({ status: "FAILED", message: "Temporary Password is not correct" });
        }
    } catch (error) {
        console.error("Error verifying temporary password:", error);
        res.json({ status: "FAILED", message: "Temporary Password verification failed" });
    }
});

//Verify email
router.get("/verify/:userId/:uniqueString", (req, res) => {
    let {userId, uniqueString} = req.params;
    console.log("verifying user ...");

    //Does the verification record exist?
    UserStatus
        .find({userId})
        .then((result) => {
            console.log("verifying user : " + userId);

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
                                    let message = "Account deleted - expired - sign up again";
                                    res.redirect(`/user/verified/?error=true&message=${message}`);
                                    //Record was deleted
                                    //Message should be that the link has expired and they'll need to sign up again
                                    //MORE BLASTED ROUTING
                                })
                                .catch(err => {

                                    console.log(err);
                                    let message = "Error occured";
                                    res.redirect(`/user/verified/?error=true&message=${message}`);
                                    //MORE DAMNED ROUTING ARGH!!
                                }) 
                        })
                        .catch((err) => {
                            console.log(err);
                            let message = "Error occured";
                            res.redirect(`/user/verified/?error=true&message=${message}`);
                            //Same routing stuff as earlier (later technically? Look at the last catch in this function)
                        })
                } else { //If there is a valid record, so validate!
                    //Compare the hashed string to the db
                    bcrypt
                    .compare(uniqueString, hashedUniqueString)
                    .then(result => {
                        console.log("made it past bcrypt");
                        if (result) {
                            console.log("strings match when verifying");
                            //strings match
                            User
                            .updateOne({_id: userId}, {status: 1})
                            .then(() =>{
                                UserStatus
                                .deleteOne({userId})
                                .then(() => {
                                    console.log("verified");
                                    res.sendFile(path.join(__dirname, "./../views/verified.html"));
                                    //Okay this time the routing is good. Just send it to the verified page (I think?) I will link the stuff I'm following
                                    // in the discord
                                })
                                .catch(error => {
                                    console.log(console.error);
                                    let message = "Error occured";
                                    res.redirect(`/user/verified/?error=true&message=${message}`);
                                    //Okay so the routing stuff goes like this:
                                    // There is an html page that needs to take in a message from these routing commands and takes the message as an input
                                    // That's it. It all goes on one page, I just don't have the will or the knowledge to do this with
                                    // any level of effiency. Please.
                                })
                            })
                            .catch(error => {
                                console.log(error);
                                let message = "An error occured while updating records";
                                res.redirect(`/user/verified/?error=true&message=${message}`);
                                
                                //ARG THIS ROUTING FUUUUUUUUUU
                            })
                        } else {
                            console.log("strings don't match");
                        }

                        

                    })

                }

            } else { //Record doesn't exist (result length = 0)
                //Paste same thing here as in the catch block below for routing
                let message = "No record exists, you may already be verified";
                res.redirect(`/user/verified/?error=true&message=${message}`);
            }
        })
        .catch((err) => {
            console.log(err);
            //MAKE THIS A ROUTE TO AN HTML PAGE THAT SAYS THERE'S AN ERROR IN CHECKING VERIFICATION RECORD
            let message = "An error occured when checking for existing user verification record";
            res.redirect(`/user/verified/?error=true&message=${message}`);
        })
});

//Verify path route
router.get("/verified", (req, res) => {
    res.sendFile(path.join(__dirname, "./../views/verified.html"));
})

router.delete("/card/:cardId/:userId", (req, res) => {
    console.log("deleting card");
    const { cardId, userId } = req.params;

    paymentCard.findOneAndDelete({ _id: cardId, userId: userId })
        .then(result => {
            if (!result) { // If the card doesn't exist or the user doesn't have permission
                console.log("permission denied or no card");
                return res.status(404).json({
                    status: "FAILED",
                    message: 'Card not found or you do not have permission to delete this card'
                });
            }
            console.log("deletion successful");
            // If the card was successfully deleted
            sendProfileUpdatedEmail(userId);
            return res.status(200).json({
                status: "SUCCESS",
                message: 'Card deleted successfully',
                deletedCard: result // Optional: Return the deleted card if needed
            });
        }).catch(error => {
            console.log(`Error: ${error}`);
            return res.status(500).json({
                status: "FAILED",
                message: 'Error deleting card'
            });
        });
});

router.post("/addCard/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        // Check if the user already has three or more cards
        const cardCount = await paymentCard.countDocuments({ userId: userId });
        if (cardCount >= 3) {
            return res.json({
                status: "FAILED",
                message: "You have already reached the maximum number of cards (3)"
            });
        }

        let { cardType, expDate, cardNumber, billingAddr, billingCity, billingState, billingZip } = req.body;

        const attributes = [
            { name: 'cardType', value: cardType, pattern: /^.{1,}$/, errMessage: 'Invalid cardType', required: true },
            { name: 'expDate', value: expDate, pattern: /^.{1,}$/, errMessage: 'Invalid expDate', required: true },
            { name: 'cardNumber', value: cardNumber, pattern: /^.{16}$/, errMessage: 'Invalid cardNumber', required: true },
            { name: 'billingAddr', value: billingAddr, pattern: /^[1-9][0-9]*[ ]+[a-zA-Z ]+$/, errMessage: 'Invalid billingAddr', required: true },
            { name: 'billingCity', value: billingCity, pattern: /^[a-zA-z ]+$/, errMessage: 'Invalid billingCity', required: true },
            { name: 'billingState', value: billingState, pattern: /^.{1,}$/, errMessage: 'Invalid billingState', required: true },
            { name: 'billingZip', value: billingZip, pattern: /^(?=(?:.{5}|.{9})$)[0-9]*$/, errMessage: 'Invalid billingZip', required: true }
        ];
        for (const attribute of attributes) {
            if (typeof attribute.value === 'string') {
                attribute.value = attribute.value.trim(); //Trimming all the attributes
            }
            //Checks if an attribute is empty
            if (!attribute.value) {
                if (attribute.required) { //If required
                    console.log(attribute.name + " is required");
                    return res.json({
                        status: "FAILED",
                        message: 'Empty input fields, please enter ' + attribute.name,
                    });
                }
            } else if (attribute.pattern && !attribute.pattern.test(attribute.value)) {
                console.log("Doesn't meet regex");
                return res.json({
                    status: 'FAILED',
                    message: attribute.errMessage,
                });
            }
        }

        // done with checking, time to add a card brother

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.json({
                status: "FAILED",
                message: "User not found"
            });
        }
        
        const lastFourDigits = cardNumber.slice(-4);
        // Hash everything except the last 4 digits
        const hashedPortion = bcrypt.hashSync(cardNumber.slice(0, -4), 10); // Adjust the salt rounds as needed
        // Concatenate the hashed portion with the last 4 digits
        const hashedCreditCard = hashedPortion + lastFourDigits;
        
        const newPaymentCard = new paymentCard({
            userId: user._id,
            cardType,
            expDate,
            cardNumber: hashedCreditCard,
            billingAddr,
            billingCity,
            billingState,
            billingZip
        });
        await newPaymentCard.save();
        sendProfileUpdatedEmail(userId);
        res.json({
            status: "SUCCESS",
            message: "Card successfully added"
        });
    } catch (error) {
        console.error("Error adding card:", error);
        res.json({
            status: "FAILED",
            message: "An error occurred while adding the payment card"
        });
    }
});

router.get("/pullCCsfromUserId/:id", async (req, res) =>{
    const uid = req.params.id; //Pulling movie from params
    
    paymentCard.find({userId: uid})
        .then(result => {
            if(!result){ //If the userID doesn't exist
                return res.json({
                    status: "FAILED",
                    message: 'Movie does not exist'
                });
            }   
            return res.json(result); //This just returns the full json of the items in the User
        }).catch(error =>{
            //console.log(`Error: ${error}`);
            return res.json({
                status: "FAILED",
                message: 'Error with pulling data'
            });
        })
})


router.get("/pullCCsfromUserId/:id", async (req, res) =>{
    const uid = req.params.id; //Pulling movie from params
    
    paymentCard.find({userId: uid})
        .then(result => {
            if(!result){ //If the userID doesn't exist
                return res.json({
                    status: "FAILED",
                    message: 'Movie does not exist'
                });
            }   
            return res.json(result); //This just returns the full json of the items in the User
        }).catch(error =>{
            //console.log(`Error: ${error}`);
            return res.json({
                status: "FAILED",
                message: 'Error with pulling data'
            });
        })
})

//API to update status and type 
router.post("/editTypeStatus/:userId", async (req, res) => {
    let { userId } = req.params;
    let { status, type } = req.body; 
    const userUpdates = {};

    if (status !== null || type !== undefined || status == 1 || status == 2 || status == 3 )
        { userUpdates["status"] = status; }   //If status is being changed
    if (type !== null || type !== undefined || type == 1 || type == 2)
        { userUpdates["type"] = type; }   //If type is being changed

    const userFilter = {_id: userId};

    await User.findOneAndUpdate(userFilter, {$set: userUpdates}, {new: true})
                .catch((error) => {
                    return res.json({
                    status: 'FAILED',
                    message: "User not found",
                });
            });
    return res.json({
        status: "SUCCESSFUL",
        message: "User status/type updated!"
    });



});

//Delete user
router.post("/deleteUser/:email", async (req, res) => {
    let { email } = req.params;
    
    try {
        const userExists = await User.exists({ email: email });
        if (userExists) {
            const deleteUser = await User.findOneAndDelete({ email: email }); //Delete promo
            return res.json({
                status: "SUCCESS",
                message: "User deleted successfully",
            });
        } else {
            return res.json({
                status: "FAILED",
                message: "User not found"
            });
        }
    } catch (err) {
        return res.json({
            status: "FAILED",
            message: "Error deleting User: " + err.message
        });
    }
});







module.exports = router;