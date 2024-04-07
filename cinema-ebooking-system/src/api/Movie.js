const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

/*
    THIS FILE SHOULD ONLY HOLD: ADDMOVIE, DELETEMOVIE, AND UPDATEMOVIE
*/
/*
    Reviews are not added initially to a movie, but are updated either within the Admin page or a user submits a review
*/


function generateAttributes(title, category, cast, genre, director, producer, synopsis, trailerVideoLink, 
    trailerPictureLink, filmRating) {
    return [
        { name: 'title', value: title, pattern: /^[0-9a-zA-Z-!]+$/, errMessage: 'Invalid title entered'},
        { name: 'category', value: category, pattern: /^[a-zA-Z ]+$/, errMessage: 'Invalid category entered'},
        { name: 'cast', value: cast, pattern: /^[A-Za-z\s]+$/, errMessage: 'Invalid cast entered'},
        { name: 'genre', value: genre, pattern: /^[a-zA-Z ]+$/, errMessage: 'Invalid genre entered'},
        { name: 'director', value: director, pattern: /^[a-zA-Z ]+$/, errMessage: 'Invalid director entered'},
        { name: 'producer', value: producer, pattern: /^[a-zA-Z ]+$/, errMessage: 'Invalid producer'},
        { name: 'synopsis', value: synopsis, pattern: /^[0-9a-zA-Z-!,.? ]+$/, errMessage: 'Invalid synopsis'},
        { name: 'trailerVideoLink', value: trailerVideoLink, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid video'}, //Real regex: [^/?]+
        { name: 'trailerPictureLink', value: trailerPictureLink, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid picture'},
        { name: 'filmRating', value: filmRating, pattern: /^[0-9a-zA-z- ]*$/, errMessage: 'Invalid film rating'},
        //Attributes left out: payment card and showTime as both are their own schemas
        //TIME REGEX: (\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (?:[01]\d|2[0-3]):([0-5]\d):([0-5]\d)
        //!!!!Time has been removed. The movie does not hold it's own time, the showtime does
    ];
}


/*
    Function that checks if user is admin, if not, kick back to homepage
*/
async function checkAdmin(userId){
    await User.findbyId({_id, userId})
        .then(result => {
            if(result.type == 1) { //If non-admin
                result.redirect('/'); // send to home
                return false
            }
        });
}   

/*
    Grabs userId from localStorage
*/
function getLoggedInUserId(){
    return localStorage.getItem('loggedInUserId');
}


//API Route to add a movie:
router.post("/addMovie", (req, res) => {
    
    //Admin check!
    // if(checkAdmin(getLoggedInUserId()) == false){ //Nested functions, great job!
    //     return res.json({
    //         status: 'FAILED',
    //         message: 'User does not have permission to access this!'
    //     })
    // }


    //Bringing all movie attributes from formData
    let {title, category, cast, genre, director, producer, synopsis, trailerVideoLink, 
        trailerPictureLink, filmRating 
    } = req.body; 

    //Calls genAttributes from top of file
    const movieAttributes = generateAttributes(title, category, cast, genre, director, producer, synopsis, trailerVideoLink, 
        trailerPictureLink, filmRating);   
    //fault protection, trim all strings for clearance into dataset
    for(const attribute of movieAttributes ) {
        if(typeof attribute.value == 'string'){
            attribute.value = attribute.value.trim();
        }
        console.log(attribute.name + ' : ' + attribute.value + ' : ' + attribute.pattern); //Kept for debugging

        //if an attribute is empty and required, throw 500(FAILED)
        if((attribute.value === null || attribute.value === undefined)){
            return res.json({
                status: "FAILED",
                message: 'Empty input fields, please enter ' + attribute.name ,
            });
                        
        }else if(attribute.name == "cast"){ //String array regex checking for cast and 
            console.log("Cast!");
            const isValid = attribute.value.every(member => attribute.pattern.test(member)); //Checks if every portion of a string is valid
            console.log(isValid);
            if(!isValid){
                return res.json({
                    status: 'FAILED',
                    message: attribute.errMessage,
                });
            }
        }else if (attribute.pattern && !attribute.pattern.test(attribute.value)) {
            return res.json({
                status: 'FAILED',
                message: attribute.errMessage,
            });
        }
    }


    //TODO: db has not been pinged yet - may want to check this
    //creates movie object
    const newMovie = new Movie ({
        title, category, cast, genre, director, producer, synopsis, trailerVideoLink, 
        trailerPictureLink, filmRating
    });

    
    //This saves the new user with a success message
    newMovie.save().then(result => {
        return res.json({
            status: "SUCCESS",
            message: 'Movie created successfully',
        });
    })
    .catch(err => {
        //no need to verify email, so we just send a error message in case something doesn't go right:)
        res.json({
            status: "FAILED",
            message: "An error occured while adding the movie"
        });
    });



}); //router


//API Route to update a Movie

router.post("/updateMovie/:movieTitle", async (req, res) => {

    //Admin check!
    // if(checkAdmin(getLoggedInUserId()) == false){ //Nested functions, great job!
    //     return res.json({
    //         status: 'FAILED',
    //         message: 'User does not have permission to access this!'
    //     })
    // }
    let { movieTitle } = req.params;    //finding movie based on title since _id isn't reasonable for admin to input
    let {title, category, cast, genre, director, producer, synopsis, trailerVideoLink, 
        trailerPictureLink, filmRating 
    } = req.body;
    const movieAttributes = generateAttributes(title, category, cast, genre, director, producer, synopsis, trailerVideoLink, 
        trailerPictureLink, filmRating);
    const movieUpdates = {};    //Set of updated movie attributes


    for(const attribute of movieAttributes ) {
        if(typeof attribute.value == 'string'){
            attribute.value = attribute.value.trim();
        }

        //if an attribute is empty and required, throw 500(FAILED)
        if((attribute.value === null || attribute.value === undefined)){
            console.log(attribute.name + " is not being udpated");
            continue; //If there is not a value for the attribute, continue to the next iteration of the loop
                        
        }else if(attribute.name == "cast"){ //String array regex checking for cast and 
            console.log("Cast!");
            const isValid = attribute.value.every(member => attribute.pattern.test(member)); //Checks if every portion of a string is valid
            console.log(isValid);
            if(!isValid){
                return res.json({
                    status: 'FAILED',
                    message: attribute.errMessage,
                });
            }
        }else if (attribute.pattern && !attribute.pattern.test(attribute.value)) {
            return res.json({
                status: 'FAILED',
                message: attribute.errMessage,
            });
        }
        movieUpdates[attribute.name] = attribute.value;     //Addes attribute to list of changing attributes
    }
    console.log(movieUpdates);
    console.log("Title: " + movieTitle)

    try { //Putting into a try loop because the other way was not working
        //Checking if the movie exists
        const movieExists = await Movie.exists({ title: movieTitle });
        
        if (movieExists) {
            const updatedMovie = await Movie.findOneAndUpdate( //Updating the movie
                { title: movieTitle },
                { $set: movieUpdates },
                { new: true }
            );
            return res.json({
                status: "SUCCESS",
                message: "Movie updated successfully",
            });
        } else {
            return res.json({
                status: "FAILED",
                message: "Movie not found"
            });
        }
    } catch (err) {
        return res.json({
            status: "FAILED",
            message: "Error updating movie: " + err.message
        });
    }
})

//API Route to Delete a Movie
module.exports = router;
