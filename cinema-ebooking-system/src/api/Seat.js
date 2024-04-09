const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Seat = require('../models/Seat');
const Showtime = require('../models/ShowTime');


/*
    Seats should not be created and/or destroyed often. The main action purpose of this 
    file is to update their availability. 
*/


//API to create a seat
router.post("/addSeat", async (req, res) => {
    let {showId, roomId, status} = req.body;
    

    //bring seat attributes through postman(admin functionality)
    console.log(showId + " : " + roomId + " : " + status )


    if(!showId || !roomId || !status){
        return res.json({
            status: "FAILED",
            message: "Input fields not filled out"
        });
    }    

    //validating show and room
    const showExists = await Showtime.findOne({_id : showId});
    if(!showExists){
       return res.json({
            status: "FAILED",
            message: "Invalid showtime id entered"
        });
    } //running into bugs here
    const roomExists = await Room.findOne({_id : roomId})
    if(!roomExists){
        return res.json({
         status: "FAILED",
         message: "Invalid room id entered"
        });
    }

 
    //new seat object
    const newSeat = new Seat({
        showId: showExists,
        roomId: roomExists, 
        status: status
    })
    await newSeat.save().then(result => {
        return res.json({
            status: "SUCCESS",
            message: "New Seat was created!"
        });
    }).catch(err => {
        return res.json({
            status: "FAILED",
            message: "Seat could not be created: ",
            error: err.message
        });
    })

});









//router.get("/Movi")




module.exports = router;
