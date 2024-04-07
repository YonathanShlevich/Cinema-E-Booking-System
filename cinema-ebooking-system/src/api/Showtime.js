const express = require('express');
const router = express.Router();
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



//API Route to add a movie:
router.post("/addShowtime", (req, res) => {

    //Bringing all movie attributes from formData
    let {movieId, roomId, period, date} = req.body; 
 
    


});
