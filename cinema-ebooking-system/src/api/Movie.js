const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const User = require('./../models/User');

/*
    THIS FILE SHOULD ONLY HOLD: ADDMOVIE, DELETEMOVIE, AND UPDATEMOVIE
*/
/*
    Reviews are not added initially to a movie, but are updated either within the Admin page or a user submits a review
*/


function generateAttributes(title, category, cast, genre, director, producer, synopsis, trailerVideoLink, 
    trailerPictureLink, filmRating) {
    return [
        { name: 'title', value: title, pattern: /^[0-9a-zA-Z-!':; ]+$/, errMessage: 'Invalid title entered'},
        { name: 'category', value: category, pattern: /^[a-zA-Z ]+$/, errMessage: 'Invalid category entered'},
        { name: 'cast', value: cast, pattern: /^[A-Za-z\s]+$/, errMessage: 'Invalid cast entered'},
        { name: 'genre', value: genre, pattern: /^[a-zA-Z- ]+$/, errMessage: 'Invalid genre entered'},
        { name: 'director', value: director, pattern: /^[a-zA-Z ]+$/, errMessage: 'Invalid director entered'},
        { name: 'producer', value: producer, pattern: /^[a-zA-Z ]+$/, errMessage: 'Invalid producer'},
        { name: 'synopsis', value: synopsis, pattern: /^[A-Za-z0-9,.?!'"()\-:;\s ]+$/, errMessage: 'Invalid synopsis'},
        // { name: 'trailerVideoLink', value: trailerVideoLink, pattern: /^[a-zA-Z0-9_-]{11}(?:\?.*)?$/, errMessage: 'Invalid video'},
        { name: 'trailerVideoLink', value: trailerVideoLink, pattern: /[\w-]{11}$/, errMessage: 'Invalid video'},
        { name: 'trailerPictureLink', value: trailerPictureLink, pattern: /\.(png|jpg)$/i, errMessage: 'Invalid picture'},
        //{ name: 'trailerPictureLink', value: trailerPictureLink, pattern: /^https?:\/\/(?:www\.)?[\w\-]+(?:\.[\w\-]+)+[/\w\-]*\.(?:png|jpg)$/i, errMessage: 'Invalid picture'},
        { name: 'filmRating', value: filmRating, pattern: /^[0-9a-zA-z-+ ]*$/, errMessage: 'Invalid film rating'},
        //!!!!Time has been removed. The movie does not hold it's own time, the showtime does
    ];
}


//API Route to add a movie:
router.post("/addMovie", async (req, res) => {
    

    //Bringing all movie attributes from formData
    let {title, category, cast, genre, director, producer, synopsis, trailerVideoLink, 
        trailerPictureLink, filmRating 
    } = req.body; 

    //Calls genAttributes from top of file
    const movieAttributes = generateAttributes(title, category, cast, genre, director, producer, synopsis, trailerVideoLink, 
        trailerPictureLink, filmRating);   
    
    //Checking if the movie exists using the title
    const movieExists = await Movie.exists({ title: title }); 
    
    if (movieExists){
        return res.json({
            status: "FAILED",
            message: "Movie already exists, cannot create the movie"
        })
    }

    //fault protection, trim all strings for clearance into dataset
    for(const attribute of movieAttributes ) {
        if(typeof attribute.value == 'string'){
            attribute.value = attribute.value.trim();
        }
        //console.log(attribute.name + ' : ' + attribute.value + ' : ' + attribute.pattern); //Kept for debugging

        //if an attribute is empty and required, throw 500(FAILED)
        if((attribute.value === null || attribute.value === undefined)){
            return res.json({
                status: "FAILED",
                message: 'Empty input fields, please enter ' + attribute.name ,
            });
                        
        }else if(attribute.name == "cast"){ //String array regex checking for cast and 
            //console.log("Cast!");
            const isValid = attribute.value.every(member => attribute.pattern.test(member)); //Checks if every portion of a string is valid
            //console.log(isValid);
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
            //console.log("Cast!");
            const isValid = attribute.value.every(member => attribute.pattern.test(member)); //Checks if every portion of a string is valid
            //console.log(isValid);
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
    //console.log(movieUpdates);
    //console.log("Title: " + movieTitle)

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

/* 
    API Route to only update reviews. It's just a much smaller updateMovie function made to only update reviews
*/
router.post("/updateReview/:movieTitle/:userID", async (req, res) => {
    let { movieTitle, userID } = req.params;
    let { reviews } = req.body;
    const reviewUpdates = {}; //
    reviewUpdates["reviews"] = reviews;
    if (userID !== "null") {
      
       User.findOne({_id: userID})
        .then(result => {
            if(!result){ //If the userID doesn't exist
                return res.json({
                    status: "FAILED",
                    message: 'You do not have permission to add a review'
                });
            }   
            
        }).catch(error =>{
            console.log(`Error: ${error}`);
            return res.json({
                status: "FAILED",
                message: 'Error with pulling data'
            });
        }) 
    } else {
        return res.json({
            status: "FAILED",
            message: 'You are not logged in'
        });
    }
    
    // Finding movie and updating
    try { 
        const movieExists = await Movie.exists({ title: movieTitle });
        
        if (movieExists) {
            const updatedMovie = await Movie.findOneAndUpdate( //Updating the movie
                { title: movieTitle },
                { $push: reviewUpdates },
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
router.post("/deleteMovie/:movieTitle", async (req, res) => {
    let {movieTitle} = req.params;
    try { //Putting into a try loop because the other way was not working
        //Checking if the movie exists
        const movieExists = await Movie.exists({ title: movieTitle });
        if (movieExists) {
            const deletedMovie = await Movie.findOneAndDelete({ title: movieTitle }); //Delete movie
            return res.json({
                status: "SUCCESS",
                message: "Movie deleted successfully",
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
            message: "Error deleting movie: " + err.message
        });
    }
})

//GET function to pull info from movie
router.get("/pullMovie/:movieTitle", (req, res) =>{
    const movieTitle = req.params.movieTitle; //Pulling userId from the URL parameters
    Movie.findOne({title: movieTitle})
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

module.exports = router;

//GET function to pull info from movie
router.get("/allMovies", (req, res) =>{
    const movieTitle = req.params.movieTitle; //Pulling userId from the URL parameters
    Movie.find({})
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

module.exports = router;



/*  Testing format for add/Update movie

{
    "title": "Star Trek",
    "category": "Movie",
    "cast": ["Picard", "Riker"],
    "genre": "Sci-fi",
    "director": "Frakes",
    "producer": "Lee Ventura",
    "synopsis": "Star Trek going crazy with the GM of the Athens Best Buy",
    "trailerVideoLink": "videoLink",
    "trailerPictureLink": "pictureLink",
    "filmRating": "E"
}

*/