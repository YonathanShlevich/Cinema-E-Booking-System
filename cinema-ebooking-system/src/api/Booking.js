const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const ShowTime = require('../models/ShowTime');
const ShowPeriod = require('../models/ShowPeriod');
const nodemailer = require("nodemailer"); // I LOVE NODEMAILER
const paymentCard = require('../models/paymentCard');


//require("dotenv").config();

//add booking
router.post("/addBooking", async(req, res) => {


    let {bookingNumber, ticketNumber, movieTitle, showDate, showTime, creditCard, promoId, total} = req.body;
    //validate our movie, showtime, and payment cards are the real deal :P
    const valiDate = new Date(showDate); //valiDATE, get it, I'm funny
    if(isNaN(valiDate.getTime())){ //If the date is valid, then it will return false, otherwise it'll return NaN   
        return res.json({
            status: "FAILED",
            message: "invalid date"
        });
    }

    const movieObject = await Movie.findOne({ title: movieTitle });

    //get showperiod
    const convertShowPeriodtoTime = await ShowPeriod.findOne({time: showTime});
    //if the time is valid, get the id, which will be used soon
    if(convertShowPeriodtoTime){
        const showPeriodId = convertShowPeriodtoTime._id;
    }else {
        console.log("invalid showperiod");
    }

    const showTimeObject = await ShowTime.findOne({
        period: showPeriodId,
        date: valiDate
    });
    const paymentCardObject = await paymentCard.findOne({_id: creditCard});
    if(!movieObject || !showTimeObject || !paymentCardObject){
        return res.json({
            status: "FAILED",
            message: "Invalid movie, showtime, or creditcard entered"
        });
    }
    if(showTimeObject){
        const showTimePeriod = showTimeObject.period;
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
        movieTitle: movieObject, 
        showDate: showDate,
        showTime: showTimeObject, 
        creditCard: paymentCardObject,
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

//given an title, can we pull a showtime
router.get("/pullShowTimefromId/:showId", async(req, res) =>{
    console.log("pulling show time info")
    const stId = req.params.showId;
    const stObject = await ShowTime.findOne({_id: stId}).then(result => {
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
router.get("/pullCCfromId/:ccId", async(req, res) =>{
    console.log("pulling show time info")
    const ccId = req.params.ccId;
    const ccObject = await PaymentCard.findOne({_id: ccId}).then(result => {
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