const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const TicketsSchema = new Schema({
    id: String, //Pulled from Seat
    bookingId: {type: Schema.Types.ObjectId, ref: 'Booking'},
    seat: {type: Schema.Types.ObjectId, ref: 'Seat'}

});

const Tickets = mongoose.model('Tickets', TicketsSchema);

module.exports = Tickets;