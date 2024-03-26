const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Ticket = require('./Booking');

//Attributes of a User table
const BookingSchema = new Schema({
    bookingNumber: Number,
    customerId: Number,
    showTimeId: Number,
    promoId: Number,
    total: Number,
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;