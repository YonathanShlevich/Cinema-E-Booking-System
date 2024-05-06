const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Room = require('../models/Room');
const ShowPeriod = require('../models/ShowPeriod');
const ShowTime = require('../models/ShowTime');
const Seat = require('../models/Seat');
const Tickets = require('../models/Tickets');
const Booking = require('../models/Booking');const Seat = require('../models/Seat');
const Tickets = require('../models/Tickets');
const Booking = require('../models/Booking');
/*
    THIS FILE SHOULD ONLY HOLD: ADDSHOWTIME, DELETESHOWTIME, AND UPDATESHOWTIME
*/
/*
    How this works: Showtime takes in 3 schemas and a date. 
        Schema 1: Movie 
        Schema 2: Room
        Schema 3: ShowPeriod
    These all have to be created before showTime is created.
    ---------------------------------------------------------------------------------------------------------
    ShowPeriods are - for some reason - forced to be their own schema. We will create a list of showPeriods 
    from 12:00am -> 11:30pm, incrementing up everything 30 minutes.
    ---------------------------------------------------------------------------------------------------------
    Similarly, Room must also be created prior to Showtime being created. These will be static 
        !!A good idea may be to add a third attribute in Room that has the # of available seats rather than!!
        !!just the total number of seats. This will allow us to easily see if the room is full             !!
    ---------------------------------------------------------------------------------------------------------    
    Movie is also created prior to ShowTime.
*/



//API Route to add a showtime:
router.post("/addShowtime", async (req, res) => {

    /* 
        The inputs will be what the Admin will use to add a movie, so they will be 
        the functional ids.
            1) movieTitle --rather than--> _id
            2) roomName --rather than--> _id
            3) time --rather than--> _id            
    */

    //Bringing all showTime attributes from formData
    let {movieTitle, roomName, periodTime, date} = req.body; 
 
    /*
        Can't check if inputs are correct because movie, room, and showperiod are schemas that exist before
        showtime is created. They have all been previously sanitized, and should be treated as correct.
        The only thing that needs to be checked is the date attribute 
    */
    //Checking the inputted objects exist
    console.log(movieTitle + " : " + roomName + " : " + periodTime + " : " + date);
    
    if (!movieTitle || !roomName || !periodTime || !date){
        return res.json({
            status: "FAILED",
            message: "Input fields not filled out"
        });
    }    

    /*
        We need to validate date, and regex isn't the best option because it's not in a String format, but 
        rather the actual *Date* format
    */
    const valiDate = new Date(date); //valiDATE, get it, I'm funny
    if(isNaN(valiDate.getTime())){ //If the date is valid, then it will return false, otherwise it'll return NaN   
        return res.json({
            status: "FAILED",
            message: "Input fields not filled out"
        });
    }
    console.log(valiDate);

    /*
        We need to now check that the input schemas themselves actually exist. We will use call 
        some findBy____ to check if they exist. findById sends a promise that returns true or false.
    */
    const movieObject = await Movie.findOne({ title: movieTitle });
    const roomObject = await Room.findOne({name: roomName});
    const showPeriodObject = await ShowPeriod.findOne({time: periodTime});
    console.log(movieObject);
    if(!movieObject || !roomObject || !showPeriodObject){
        return res.json({
            status: "FAILED",
            message: "Invalid movie, room, or showPeriod entered"
        });
    }
   
   /*
        We need to find a way to check that no movie can run at the same period in the same room on the same day.
        Just search for a showTime with all the same attributes; if it exists, then you know it's a duplicate.
   */

    const existingShowtime = await ShowTime.findOne({
        room: roomObject._id,           //Checking by _id
        period: showPeriodObject._id,   //Checking by _id
        date: valiDate                  //using previously created valiDate
    });

    if (existingShowtime) {
        return res.json({
            status: "FAILED",
            message: "A showtime already exists during this period in this room on this date"
        });
    }

    // console.log(movieObject);

    /*
        Once all the schemas have been confirmed and thet date has been confirmed, create a new 
        ShowTime object
    */
    const newShowTime = new ShowTime({
        movie: movieObject,
        room: roomObject,
        period: showPeriodObject,
        date: date
    })
    
    //Seats should be associated with showTime. Creates seats based on room size
    for (let i = 1; i <= roomObject.totalSeats; i++) {
        const newSeat = new Seat({
            showTime: newShowTime._id,
            seatNumber: i
        });
        await newSeat.save();
        newShowTime.seats.push(newSeat);
    }
    
    //Seats should be associated with showTime. Creates seats based on room size
    for (let i = 1; i <= roomObject.totalSeats; i++) {
        const newSeat = new Seat({
            showTime: newShowTime._id,
            seatNumber: i
        });
        await newSeat.save();
        newShowTime.seats.push(newSeat);
    }
    
    await newShowTime.save().then(result => {
        return res.json({
            status: "SUCCESS",
            message: "New showTime was created!"
        });
    }).catch(err => {
        return res.json({
            status: "FAILED",
            message: "ShowTime could not be created: ",
            error: err.message
        });
    })

});


/* 
    There is no distict functional id for showtime, so we need to decide how pull the correct showtime
        Ideas:
            - We have to check all 4 attributes at once. The harder part of this is that the front end will 
              have to compensate for this by only showing results for the rest of the inputs based on the
              inital input.
            - We will still check all 4 attributes, but we'll make it more annoying on a UX level. 
              We could just ask the admin to properly input all the attributes without any list of 
              possibilities. This is the easiest to implement but worse for UX
    This is a blocker until we decide as a group how to do this.
    Once we figure out how to do this, delete showtime will be unblocked as well.
*/


//API Route to udpate a showtime:
router.post("/updateShowtime", async (req, res) => {

})
//GET function to pull info from showtime by title
router.get("/pullShowtime/:movieTitle", async (req, res) =>{
    const movieTitle = req.params.movieTitle; //Pulling movie from params
    const movieObject = await Movie.findOne({ title: movieTitle });
    ShowTime.findOne({movie: movieObject._id})
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

//GET function to pull info from showtime by id
router.get("/pullShowtimeFromID/:showtimeID", async (req, res) => {
    const showtimeID = req.params.showtimeID;

    try {
        const result = await ShowTime.findOne({ _id: showtimeID })
            .populate('period', 'time')
            .populate('seats');

        if (!result) {
            return res.json({
                status: "FAILED",
                message: 'Showtime does not exist'
            });
        }

        
        console.log(result)
        return res.json(result);
    } catch (error) {
        console.error('Error:', error);
        return res.json({
            status: "FAILED",
            message: 'Error with pulling data'
        });
    }
});


//given an id, can we pull a showperiod
router.get("/pullShowPeriodfromId/:periodId", async(req, res) =>{
    const periodId = req.params.periodId;
    const periodObject = await ShowPeriod.findOne({_id: periodId}).then(result => {
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
//GET function to pull info from showtime
router.get("/allShowtimes", (req, res) =>{
    //const movieTitle = req.params.movieTitle; 
    ShowTime.find({})
        .then(result => {
            
            if(!result){ //If the userID doesn't exist
                //console.log('empty req')
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



//Delete showtime and all seats associated with it
//Possibly also all bookings with the movie
router.post("/deleteShowtime/:showtimeID", async (req, res) => {
    const { showtimeID } = req.params;
    console.log(showtimeID);
    try { //Putting into a try loop because the other way was not working
        //Checking if the movie exists
        const showTimeExists = await ShowTime.exists({ _id: showtimeID });
        if (showTimeExists) {
            //Delete all seats, tickets, and bookings related to the showtime
            
            // Delete associated seats
            await Seat.deleteMany({ showTime: showtimeID });

            // Delete associated tickets
            // await Tickets.deleteMany({ showTime: showtimeID });

            // Delete associated bookings
            // await Booking.deleteMany({ showTime: showtimeID });

            // Delete the showtime itself
            await ShowTime.findByIdAndDelete(showtimeID);

            return res.json({
                status: "SUCCESS",
                message: "Showtime and all associated objects deleted successfully",
            });
        } else {
            return res.json({
                status: "FAILED",
                message: "Showtime not found"
            });
        }
    } catch (err) {
        return res.json({
            status: "FAILED",
            message: "Error deleting showtime: " + err.message
        });
    }
})


module.exports = router;