const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const ShowTime = require('../models/ShowTime');
const ShowPeriod = require('../models/ShowPeriod');
const paymentCard = require('../models/paymentCard');
const User = require('../models/User');
const nodemailer = require("nodemailer"); // I LOVE NODEMAILER



//require("dotenv").config();

//add booking
router.post("/addBooking", async(req, res) => {


    let {bookingNumber, ticketNumber, showTime, creditCard, userId, promoId, total} = req.body;
    //validate our movie, showtime, and payment cards are the real deal :P

    

    //find showtime and user objects to make sure they're real

    const showTimeObject = await ShowTime.findOne({
        _id: showTime
    });
    const userObject = await User.findOne({
        _id: userId
    });
    const paymentCardObject = await paymentCard.findOne({_id: creditCard});
    if(!showTimeObject || !paymentCardObject){
        return res.json({
            status: "FAILED",
            message: "Invalid movie, showtime, or creditcard entered"
        });
    }
    //check that the booking, promoId and ticket number don't already exist
    validateBn = await Booking.findOne({bookingNumber: bookingNumber});
    validateTn = await Booking.findOne({ticketNumber: ticketNumber});
    validatePr = await Booking.findOne({promoId: promoId});
    if(validateBn || validateTn|| validatePr) {
        return res.json({
            status: "FAILED",
            message: "duplicate booking number, ticket number, or promo id entered- please try another number/id"
        });
    }
    
    //object calling:
    const newBooking = new Booking ({
        bookingNumber: bookingNumber,
        ticketNumber: ticketNumber, 
        showTime: showTimeObject, 
        creditCard: paymentCardObject,
        userId: userObject,
        promoId: promoId,
        total: total
    })
    await newBooking.save().then(result => {
        return res.json({
            status: "SUCCESS",
            message: "New movie Booking was created!"
        });
    }).catch(err => {
        return res.json({
            status: "FAILED",
            message: "Booking could not be created: ",
            error: err.message
        });
    })
})

//pull cc info given ccid
router.get("/pullCCfromId/:ccId", async(req, res) =>{
    console.log("pulling show time info")
    const ccId = req.params.ccId;
    paymentCard.findOne({_id: ccId}).then(result => {
        if(!result){ //If the userID doesn't exist
            return res.json({
                status: "FAILED",
                message: 'showperiod does not exist'
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

//given an title, can we pull a showtime
router.get("/pullBookingsfromUserId/:uId", async(req, res) =>{
    console.log("pulling show time info")
    const uId = req.params.uId;
    Booking.find({userId: uId}).then(result => {
        if(!result){ //If the userID doesn't exist
            return res.json({
                status: "FAILED",
                message: 'no bookings exist for this user!'
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

router.get("/allBookings", (req, res) =>{
    //const movieTitle = req.params.movieTitle; 
    Booking.find({})
        .then(result => {
            
            if(!result){ //If the userID doesn't exist
                //console.log('empty req')
                return res.json({
                    status: "FAILED",
                    message: 'Booking does not exist'
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

module.exports = router;