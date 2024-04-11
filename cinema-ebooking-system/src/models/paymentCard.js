const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const paymentCardSchema = new Schema({
    userId: String,
    cardType: String,
    expDate: Date,
    cardNumber: String,
    billingAddr: String,
    billingCity: String, 
    billingState: String, 
    billingZip: Number
});

const paymentCard = mongoose.model('paymentCard', paymentCardSchema);

module.exports = paymentCard;