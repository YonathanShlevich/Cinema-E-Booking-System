const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const MovieSchema = new Schema({
    title: String,
    category: String, //Now showing or coming soon
    cast: [{type: String}], //string array of all cast
    genre: String,
    director: String,
    producer: String,
    synopsis: String,
    reviews: [{type: String}], //Array of reviews
    trailerVideoLink: String,
    trailerPictureLink: String,
    filmRating: String,
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;