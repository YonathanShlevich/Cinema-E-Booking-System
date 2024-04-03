const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Attributes of a Showtime table
const ShowtimeSchema = new Schema({
    id: String, //pulled from booking
    movieId: Number,
    roomId: Number,
    period: Number,
    date: Date,
});

const Showtime = mongoose.model('Showtime', ShowtimeSchema);

module.exports = Showtime;