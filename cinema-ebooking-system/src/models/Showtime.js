const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Showtime = require('./Showtime');


//Attributes of a Showtime table
const ShowtimeSchema = new Schema({
    id: Number,
    movieId: Number,
    roomId: Number,
    period: Number,
    date: Date,
});

const Showtime = mongoose.model('Showtime', ShowtimeSchema);

module.exports = Showtime;