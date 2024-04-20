const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const BookingSchema = new Schema({
    bookingNumber: Number,
    ticketNumber: Number,
    movieTitle: {type: Schema.Types.ObjectId, ref: 'Movie'},
    showDate: Date,
    showTime: {type: Schema.Types.ObjectId, ref: 'Showtime'},
    creditCard: {type: Schema.Types.ObjectId, ref: 'paymentCard'},
    promoId: Number,
    total: Number,
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;