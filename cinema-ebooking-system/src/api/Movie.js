const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

/*
    THIS FILE SHOULD ONLY HOLD: ADDMOVIE, DELETEMOVIE, AND UPDATEMOVIE
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

    optionalCounter = 0;//count of optional vals

    
    const movieAttributes = generateAttributes(title, category, cast, genre, director, producer, synopsis, reviews, trailerVideoLink, 
        trailerPictureLink, filmRating, showTime, times);
        
        //fault protection, trim all strings for clearance into dataset
        for(const attribute of movieAttributes ) {
            if(typeof attribute.value == 'string'){
                attribute.value = attribute.value.trim();
            }
            console.log(attribute.value + ' : ' + attribute.pattern);

            //if an attribute is empty and required, throw 500(FAILED)
            if((!attribute.value)){
                if(attribute.required) {
                    return res.json({
                        status: "FAILED",
                        message: 'Empty input fields, please enter ' + attribute.name ,
                    });
                }else { //optional value
                    optionalCounter++; 
                }
            
                
            }else if (attribute.pattern && !attribute.pattern.test(attribute.value)) {
                return res.json({
                    status: 'FAILED',
                    message: attribute.errMessage,
                });
            }
        }
        console.log(optionalCounter)
    //Checking if all or no optional values are filled out
    if(optionalCounter != 11 && optionalCounter != 0 ){
        return res.json({
            status: 'FAILED',
            message: "If one optional field is filled, the rest must be filled.",
        });
    }
 
    //Gen attributes

    //TODO: db has not been pinged yet - may want to check this
    //creates movie object
    const newMovie = new Movie ({
        title, category, cast, genre, director, producer, synopsis, reviews, trailerVideoLink, 
        trailerPictureLink, filmRating, showTime, times
    })

    //IN TESTING: SAVING MOVIE PROFILE IN DB

    /**
     * /This saves the new user with a success message
                newMovie.save().catch(err => {
                            //no need to verify email, so we just send a error message in case something doesn't go right:)
                            res.json({
                                status: "FAILED",
                                message: "An error occured while adding the movie"
                            });
                        });
     */



}); //router


//API Route to Update a Movie

router.post("/updateMovie/:movieId", async (req, res) => {
    let { movieId } = req.params; //save current movie parameters
    //attributes available to change
    let {title, category, cast, genre, director, producer, synopsis, reviews, trailerVideoLink, 
        trailerPictureLink, filmRating, showTime, times 
    } = req.body; 

    const movieAttributes = [
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

    const movieUpdates = {}; //home udpates not necessary since this is an administrative function

    for(const attribute of attributes){
        if(attribute.value && typeof attribute.value === 'string'){
            attribute.value = attribute.value.trim(); //Trimming all the attributes
        } else if (!attribute.value){ //attribute.name != "promo" - no need for this, may come up later
            continue; //why????
        }else if(!attribute.value || attribute.value === undefined){ //assuming undefined means empty here, failed status for empty responses
            if(attribute.required){ //If required
                return res.json({
                    status: "FAILED",
                    message: 'Empty input fields, please enter ' + attribute.name ,
                });
            }
        }
        console.log(attribute.name);

        //validate empty fields
        
        
    }

})




//API Route to Delete a Movie