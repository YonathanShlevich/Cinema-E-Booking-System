const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const BookingSchema = new Schema({
    bookingNumber: Number,
    ticketNumber: Number,
    showTime: {type: Schema.Types.ObjectId, ref: 'Showtime'},
    creditCard: {type: Schema.Types.ObjectId, ref: 'paymentCard'},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    promoId: Number,
    total: Number,
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;