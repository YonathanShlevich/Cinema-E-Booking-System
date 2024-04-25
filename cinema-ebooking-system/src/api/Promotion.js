const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');
const User = require('../models/User');
const nodemailer = require("nodemailer"); // I LOVE NODEMAILER

//Env variables
require("dotenv").config(); //TAKE A SECOND LOOK AT THIS

//nodemailer
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
});

/*
    THIS FILE SHOULD ONLY HOLD: ADDPROMOTION
*/

//Yet another API router, this time to add a promotion
router.post("/addPromotion", async (req, res) => {


    //setup request body - does promotion need an id??? CHECK THIS
    let {code, start, end, discount} = req.body;

    const validStartDate = new Date(start);
    const validEndDate = new Date(end); //unfortunately i couldn't use a cute pun(^_^)
    if((isNaN(validStartDate.getTime())) || (isNaN(validEndDate.getTime()))){ //return false start date or end date to promo   
        return res.json({
            status: "FAILED",
            message: "Either the Start date or End Date is not valid"
        }); //return bad start/end date
    }

    //validate that the discount cannot be a number above 100 or below zero
    if(discount > 100 || discount < 0){
        return res.json({
            status: "FAILED",
            message: "please enter a discount value between 0 and 100"
        });
    }
    
    //check if the code/id is not a duplicate - removed
    /*
    const dupId = await Promotion.findOne({
        id: id
    });
    */
    const dupCode = await Promotion.findOne({
        code: code
    })
    /*
    if(dupId){
        return res.json({
            status: "FAILED",
            message: "duplicate promotion id entered - please try another id"
        });
    }
    */
    if(dupCode){
        return res.json({
            status: "FAILED",
            message: "duplicate promotion code entered - please try another code"
        });
    }

    const newPromo = new Promotion ({
        code: code, 
        start: start,
        end: end,
        discount: discount
    }) //setup object - can you call it like this? time to find out!!!

    await newPromo.save().then(result => {
        sendVerificationEmail({ code, end, discount }, res);
        return res.json({
            status: "SUCCESS",
            message: "New promotion was created!"
        });
        
    }).catch(err => {
        return res.json({
            status: "FAILED",
            message: "promotion could not be created: ",
            error: err.message
        });
    })

});
router.get("/allPromos", (req, res) =>{
    //const movieTitle = req.params.movieTitle; 
    Promotion.find({})
        .then(result => {
            
            if(!result){ //If the userID doesn't exist
                //console.log('empty req')
                return res.json({
                    status: "FAILED",
                    message: 'Promotion does not exist'
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

//Send email?
/*
    1) Find all users with promotion being true
    2) Send email out to each user
        -> We are doing in probably the worst way possible, with a for loop
*/

const sendVerificationEmail = async ({code, end, discount}, res) => {

    try {
        const promoUsers = await User.find({ promo: false });
        //console.log(promoUsers); //Debugging only

        for (const user of promoUsers) { //For loop to go through all users found
            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: user.email, // Use the user's email address
                subject: "Yessir! Promotion time",
                html: `<p>Congratulations! You've been given a promotion code for ${discount}% off! Promo lasts until ${end}!<br><br> Promo Code: ${code}</p>`, // Fill in the email content
            };

            // Send email
            transporter.sendMail(mailOptions); // You need to implement this function to send the email
        }

        console.log("Emails sent successfully to all users.");
    } catch (error) {
        console.error("Error sending emails:", error);
    }
}

module.exports = router;



