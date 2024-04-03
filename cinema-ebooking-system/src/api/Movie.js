const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
/*
    THIS FILE SHOULD ONLY HOLD: ADDMOVIE, DELETEMOVIE, AND UPDATEMOVIE
*/



function generateAttributes(title, category, cast, genre, director, producer, synopsis, trailerVideoLink, 
    trailerPictureLink, filmRating, times) {
    return [
        { name: 'title', value: title, pattern: /^[0-9a-zA-Z-!]+$/, errMessage: 'Invalid title entered'},
        { name: 'category', value: category, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid category entered'},
        { name: 'cast', value: cast, pattern: /^[a-zA-Z, ]+$/, errMessage: 'Invalid cast entered'},
        { name: 'genre', value: genre, pattern: /^[a-zA-Z ]+$/, errMessage: 'Invalid genre entered'},
        { name: 'director', value: director, pattern: /^[a-zA-Z ]+$/, errMessage: 'Invalid director entered'},
        { name: 'producer', value: producer, pattern: /^[a-zA-Z ]+$/, errMessage: 'Invalid producer'},
        { name: 'synopsis', value: synopsis, pattern: /^[0-9a-zA-Z-! ]+$/, errMessage: 'Invalid synopsis'},
        { name: 'trailerVideoLink', value: trailerVideoLink, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid video'}, //Real regex: [^/?]+
        { name: 'trailerPictureLink', value: trailerPictureLink, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid picture'},
        { name: 'filmRating', value: filmRating, pattern: /^[0-9a-zA-z- ]*$/, errMessage: 'Invalid film rating'},
        { name: 'times', value: times, pattern: /^[0-9a-zA-z-,: ]+$/, errMessage: 'Invalid time' },
        //Attributes left out: payment card and showTime as both are their own schemas
        //TIME REGEX: (\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (?:[01]\d|2[0-3]):([0-5]\d):([0-5]\d)
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
    let {title, category, cast, genre, director, producer, synopsis,  trailerVideoLink, 
        trailerPictureLink, filmRating, times //This line requires showTime, reviews
    } = req.body; 

    //Calls genAttributes from top of file
    const movieAttributes = generateAttributes(title, category, cast, genre, director, producer, synopsis, trailerVideoLink, 
        trailerPictureLink, filmRating, times);   //This line requires showTime, reviews
    //fault protection, trim all strings for clearance into dataset
    for(const attribute of movieAttributes ) {
        if(typeof attribute.value == 'string'){
            attribute.value = attribute.value.trim();
        }
        console.log(attribute.name + ' : ' + attribute.value + ' : ' + attribute.pattern); //Kept for debugging

        //if an attribute is empty and required, throw 500(FAILED)
        if((attribute.value === null || attribute.value === undefined)){
            if(attribute.required) {
                return res.json({
                    status: "FAILED",
                    message: 'Empty input fields, please enter ' + attribute.name ,
                });
            } // still good to keepid
            
        
            
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
        trailerPictureLink, filmRating, times //This line requires showTime, reviews
    });
    //IN TESTING: SAVING MOVIE PROFILE IN DB

    
     //This saves the new user with a success message
    newMovie.save()
    .catch(err => {
        //no need to verify email, so we just send a error message in case something doesn't go right:)
        res.json({
            status: "FAILED",
            message: "An error occured while adding the movie"
        });
    });



}); //router


//API Route to update a Movie

router.post("/updateMovie/:movieId", async (req, res) => {

    //Admin check!
    if(checkAdmin(getLoggedInUserId()) == false){ //Nested functions, great job!
        return res.json({
            status: 'FAILED',
            message: 'User does not have permission to access this!'
        })
    }


    let { movieId } = req.params; //save current movie parameters
    //attributes available to change
    let {title, category, cast, genre, director, producer, synopsis, reviews, trailerVideoLink, 
        trailerPictureLink, filmRating, showTime, times 
    } = req.body; 

    const movieAttributes = [
        { name: 'title', value: title, pattern: /^[0-9a-zA-Z-!]+$/, errMessage: 'Invalid title entered',  },
        { name: 'category', value: category, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid category entered',  },
        { name: 'cast', value: cast, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid cast entered', },
        { name: 'genre', value: genre, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid genre entered',  },
        { name: 'director', value: director, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid director entered',  },
        { name: 'producer', value: producer, pattern: /^[a-zA-Z]+$/, errMessage: 'Invalid producer', required: false},
        { name: 'synopsis', value: synopsis, pattern: /^[0-9a-zA-Z-!]+$/, errMessage: 'Invalid synopsis',  },
        { name: 'trailerPictureLink', value: trailerPictureLink, pattern: /^[^/?]+$/, errMessage: 'Invalid picture',  },
        { name: 'filmRating', value: filmRating, pattern: /^[0-9a-zA-z- ]+$/, errMessage: 'Invalid film rating',  },
        { name: 'times', value: times, pattern: /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (?:[01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, errMessage: 'Invalid time',  },
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
module.exports = router;
