const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');
const User = require('../models/User');
const nodemailer = require("nodemailer"); // I LOVE NODEMAILER
//UUID handling
const {v4: uuidv4} = require("uuid"); //The 'v4' is the c4 model within uuid
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
        return res.json({
            status: "SUCCESS",
            message: "New promotion was created!"
        });
        
        //sendVerificationEmail(result, res);
    }).catch(err => {
        return res.json({
            status: "FAILED",
            message: "promotion could not be created: ",
            error: err.message
        });
    })

});

//Send email?
const sendVerificationEmail = async ({code, email, discount}, res) => {

    const promoUsers = await User.find({promo: promotion});
    //URL for the email, in our case currently it is localhost:4000
    console.log("sendVerEmail email: " + email);
    console.log("sendVerEmail id: " + _id);

    const currentURL = "http://localhost:4000/";

    const uuidString = uuidv4() + _id;

    //Mail options
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Yessir! Promotion time",
        html: `<p>Congratulations! You've been given a promotion code for ${discount}% off!<br><br> Promo Code: ${code}`, //THIS NEEDS TO BE FILLED IN
    };
}

module.exports = router;



