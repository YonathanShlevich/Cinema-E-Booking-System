const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Attributes of a Showtime table
const ShowtimeSchema = new Schema({
    movie: {type: Schema.Types.ObjectId, ref: 'Movie'},
    room: {type: Schema.Types.ObjectId, ref: 'Room'},
    period: {type: Schema.Types.ObjectId, ref: 'ShowPeriod'}, //Period is a set chunk of time the theater has for a movie, we will split it into 30 minute inverals
    date: Date,
    seats: [{type: Schema.Types.ObjectId, ref: 'Seat'}] // Array of seats
});

const Showtime = mongoose.model('Showtime', ShowtimeSchema);

module.exports = Showtime;