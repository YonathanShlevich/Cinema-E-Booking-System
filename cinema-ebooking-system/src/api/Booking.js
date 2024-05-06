const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const ShowTime = require('../models/ShowTime');
const paymentCard = require('../models/paymentCard');
const User = require('../models/User');
const Seat = require('../models/Seat');
const Tickets = require('../models/Tickets');
const nodemailer = require("nodemailer"); // I LOVE NODEMAILER

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
});

require("dotenv").config();

//add booking
router.post("/addBooking", async(req, res) => {


    let {tickets, showTime, creditCard, userId, promoId, total} = req.body;
    //validate our movie, showtime, and payment cards are the real deal :P

    

    //find showtime and user objects to make sure they're real

    const showTimeObject = await ShowTime.findOne({
        _id: showTime
    }).populate('movie period');
    let movieTitle = showTimeObject.movie.title;
    let movieTime = showTimeObject.period.time;
    let movieDate = showTimeObject.date;
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
            createdTickets.push(newTicket);
        } else {
            //If seat is not available
            return res.json({
                status: "FAILED",
                message: `Seat ${seatNumber} is not available`
            });
        }
    }

    //Save the tickets after they're all confirmed and retace if failed
    try {
        for (let i = 0; i < createdTickets.length; i++) {
            await createdTickets[i].save();
        }
    } catch (error) {
        // Rollback changes if there's an error
        for (let i = 0; i < createdTickets.length; i++) {
            const seat = await Seat.findById(createdTickets[i].seat);
            seat.status = 'Available';
            await seat.save();
        }
        return res.json({
            status: "FAILED",
            message: "Tickets could not be saved",
            error: error.message
        });
    }

    newBooking.tickets = createdTickets;    //Updates tickets

    await newBooking.save().then(async result => {

        //Send email after booking is complete
        try {
            //Pulls from userObject: Line 29
            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: userObject.email, // Use the user's email address
                subject: "Booking Confirmation",
                html: `<p>This is the email confirmation for your booking of ${movieTitle} at ${movieTime} on ${movieDate}. You can check your purcahse history on the OnlyReels site.</p>`, // Fill in the email content
            };

            // Send email
            transporter.sendMail(mailOptions); // You need to implement this function to send the email
        

            console.log("Email sent successfully to user.");
        } catch (error) {
            return res.json({
                status: "FAILED",
                message: "Error sending booking confirmation email",
                error: error.message
            });
        }
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
router.get("/pullBookingsfromUserId/:uId", async (req, res) => {
    console.log("pulling show time info");
    const uId = req.params.uId;
    try {
        const result = await Booking.find({ userId: uId })
            .populate({
                path: 'showTime',
                populate: [
                    { path: 'period', select:'time' },
                    { path: 'date' },
                    { path: 'movie', select:'title'}
                ]
            })
        if (!result || result.length === 0) {
            return res.json({
                status: "FAILED",
                message: 'No bookings exist for this user!'
            });
        }

        console.log(result);
        
        return res.json(result);
    } catch (error) {
        console.error('Error:', error);
        return res.json({
            status: "FAILED",
            message: 'Error with pulling data'
        });
    }
})


//given an bookingID, can we pull a booking
router.get("/pullBooking/:bookingId", async(req, res) =>{
    const bookingId = req.params.bookingId;
    try {
        const result = await Booking.findOne({ _id: bookingId })
        .populate({
            path: 'showTime',
            populate: [
                { path: 'period', select: 'time' },
                { path: 'date' },
                {path: 'movie', select: 'title'}
            ]
        })
        .populate('creditCard', 'cardType cardNumber');
            

        if (!result) {
            return res.json({
                status: "FAILED",
                message: 'Showtime does not exist'
            });
        }

        console.log(result);
        return res.json(result);
    } catch (error) {
        console.error('Error:', error);
        return res.json({
            status: "FAILED",
            message: 'Error with pulling data'
        });
    }

})

router.get("/pullBookingsfromCheckout/:bookingID", async(req, res) =>{
    const bookingID = req.params.bookingID;
    Booking.findById(bookingID).then(result => {
        if(!result){ //If the userID doesn't exist
            return res.json({
                status: "FAILED",
                message: 'This booking does not exist'
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


/* Testing info for a booking
 {
    "tickets": ["8", "1"],
    "showTime": "66367d5652a296d9f797bfc0",
    "creditCard": "660332b6e5115a9d74d7c9c1",
    "userId": "66030844736299a2f0ef8ae4",
    "promoId": 1234,
    "total": 13.75
}
 */