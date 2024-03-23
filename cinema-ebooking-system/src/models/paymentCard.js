const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const paymentCardSchema = new Schema({
    userId: String,
    cardType: String,
    expDate: Date,
    billingAddr: String,
});

const User = mongoose.model('paymentCard', paymentCardSchema);

module.exports = User;