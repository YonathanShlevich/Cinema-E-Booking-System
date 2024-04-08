const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Room = require('../models/Room');
const ShowPeriod = require('../models/ShowPeriod');
const ShowTime = require('../models/ShowTime');

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

    if(!movieObject || !roomObject || !showPeriodObject){
        return res.json({
            status: "FAILED",
            message: "Invalid movie, room, or showPeriod entered"
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

module.exports = router;