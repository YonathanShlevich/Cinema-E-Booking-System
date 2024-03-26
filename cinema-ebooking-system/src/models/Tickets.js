const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Tickets = require('./Tickets');

//Attributes of a User table
const TicketsSchema = new Schema({
    id: Number,
    bookingId: Number,
    seatId: Number

});

const Tickets = mongoose.model('Tickets', TicketsSchema);

module.exports = ShowPeriod;