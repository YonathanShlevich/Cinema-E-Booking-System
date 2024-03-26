const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ShowPeriod = require('./Seat');

//Attributes of a User table
const SeatSchema = new Schema({
    id: String, 
    showId: Number, //Pulled from showtime
    status: {
        type: String,
        enum: ['Available', 'Unavailable'],
        default: 'Available'
    },
    
});

const Seat = mongoose.model('Seat', SeatSchema);

module.exports = Seat;