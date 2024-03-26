const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Tickets = require('./Tickets');

//Attributes of a User table
const TicketsSchema = new Schema({
    id: String, //Pulled from Seat
    bookingId: Number,
    seatId: Number

});

const Tickets = mongoose.model('Tickets', TicketsSchema);

module.exports = ShowPeriod;