const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Movie = require('./Movie');

//Attributes of a User table
const MovieSchema = new Schema({
    title: String,
    category: String, 
    cast: [{type: String}], //string array of all cast
    genre: String,
    director: String,
    producer: String,
    synopsis: String,
    reviews: [{type: String}], //Array of reviews
    trailerVideoLink: String,
    trailerPictureLink: String, //Image will be stored differently, this is a placeholder
    filmRating: String,
    showTime: {type: Schema.Types.ObjectId, ref: 'ShowTime'}, //Reference to showtime schema
    times: [{type: Date}]
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;