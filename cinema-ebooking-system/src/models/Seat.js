const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const SeatSchema = new Schema({
    room: String,
    ticket: {type: Schema.Types.ObjectId, ref: 'Ticket'},
    status: {
        type: String,
        enum: ['Available', 'Unavailable'],
        default: 'Available'
    },
    seatNumber: String              //Row letter + number i.e. A5 or Z8
    
});

const Seat = mongoose.model('Seat', SeatSchema);

module.exports = Seat;