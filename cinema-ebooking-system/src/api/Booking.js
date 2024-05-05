const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const ShowTime = require('../models/ShowTime');
const paymentCard = require('../models/paymentCard');
const User = require('../models/User');
const Seat = require('../models/Seat');
const Tickets = require('../models/Tickets');
const nodemailer = require("nodemailer"); // I LOVE NODEMAILER



//require("dotenv").config();

//add booking
router.post("/addBooking", async(req, res) => {


    let {tickets, showTime, creditCard, userId, promoId, total} = req.body;
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
    /*
        We need to create as many tickets as are asked for based on the number of tickets
        To do that we need to find the seat based on the showtime and then create the tickets 
        with those seats assuming they're available
    */
    //object calling:
    const newBooking = new Booking ({ 
        showTime: showTimeObject, 
        creditCard: paymentCardObject,
        userId: userObject,
        promoId: promoId,
        total: total
    })


    const createdTickets = [];
    for (let i = 0; i < tickets.length; i++) {  //Ticket spread
        console.log(tickets[i]);
        const seatNumber = tickets[i];  //An array of seat numbers that'll get turned into tickets
        const seat = await Seat.findOne({ showTime: showTimeObject._id, seatNumber: seatNumber });  //Checks by showtime AND seatNumber 
        if (seat && seat.status === 'Available') {  //If the seat exists and is available, create the ticket
            //Making the seat unavailable
            seat.status = 'Unavailable';
            await seat.save();

            const newTicket = new Tickets({
                id: seat._id.toString(), // Assuming seat._id is unique and suitable as ticket id
                bookingId: newBooking._id, // Assuming bookingNumber is unique and suitable as booking id
                seat: seat._id
            });
            await newTicket.save();
            createdTickets.push(newTicket);
        } else {
            //If seat is not available
            return res.json({
                status: "FAILED",
                message: `Seat ${seatNumber} is not available`
            });
        }
    }

    newBooking.tickets = createdTickets;    //Updates tickets

    await newBooking.save().then(result => {

        //If a booking goes through, all the seats that get bought need to update into tickets
        //There is an array of tickets that relate to the updated seats
        return res.json(result);
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

//given an bookingID, can we pull a booking
router.get("/pullBooking/:bookingId", async(req, res) =>{
    const bookingId = req.params.booking;
    Booking.find({_id: bookingId}).then(result => {
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