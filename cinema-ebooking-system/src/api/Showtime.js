const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

/*
    THIS FILE SHOULD ONLY HOLD: ADDSHOWTIME, DELETESHOWTIME, AND UPDATESHOWTIME
*/



function generateAttributes(title, category, cast, genre, director, producer, synopsis, trailerVideoLink, 
    trailerPictureLink, filmRating, showTime, times) {
    return [
        { name: 'title', value: title, pattern: /^[0-9a-zA-Z-!]+$/, errMessage: 'Invalid title entered', required: true},
        { name: 'category', value: category, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid category entered', required: true},
        { name: 'cast', value: cast, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid cast entered',required: true},
        { name: 'genre', value: genre, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid genre entered', required: true},
        { name: 'director', value: director, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid director entered', required: true},
        { name: 'producer', value: producer, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid producer', required: false},
        { name: 'synopsis', value: synopsis, pattern: /^[0-9a-zA-Z-!]+$/, errMessage: 'Invalid synopsis', required: true},
        { name: 'trailerPictureLink', value: trailerPictureLink, pattern: /^[^/?]+$/, errMessage: 'Invalid picture', required: true},
        { name: 'filmRating', value: filmRating, pattern: /^[0-9a-zA-z- ]+$/, errMessage: 'Invalid film rating', required: true},
        { name: 'times', value: times, pattern: /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (?:[01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, errMessage: 'Invalid time', required: true},
        //Attributes left out: payment card and showTime as both are their own schemas
    ];
}



//API Route to add a movie:
router.post("/addMovie", (req, res) => {

    //Bringing all movie attributes from formData
    let {title, category, cast, genre, director, producer, synopsis, reviews, trailerVideoLink, 
        trailerPictureLink, filmRating, showTime, times 
    } = req.body; 
 
    //Gen attributes


});


//API Route to Update a Movie

router.post("/updateMovie", (req, res) => {
    
})




//API Route to Delete a Movie