const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const SeatSchema = new Schema({
    showId: {type: Schema.Types.ObjectId, ref: 'Showtime'}, //Pulled from showtime
    roomId: {type: Schema.Types.ObjectId, ref: 'Room'},
    status: {
        type: String,
        enum: ['Available', 'Unavailable'],
        default: 'Available'
    },
    
});

const Seat = mongoose.model('Seat', SeatSchema);

module.exports = Seat;