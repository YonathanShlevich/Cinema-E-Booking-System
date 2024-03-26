const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Movie = require('./Movie');

//Attributes of a User table
const MovieSchema = new Schema({
    id: String,//reference from showtime
    Title: String,
    Cast: [{type: String}], //string arr
    Genre: String
    
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;