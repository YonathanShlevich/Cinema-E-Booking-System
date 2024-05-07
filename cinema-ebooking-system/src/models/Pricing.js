const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const pricingSchema = new Schema({
    childCost: Number,  //The cost of the child ticket
    adultCost: Number,  //The cost of the adult ticket
    seniorCost: Number, //The cost of the senior ticket
    bookingFee: Number  //The booking fee
});

const Pricing = mongoose.model('Pricing', pricingSchema);

module.exports = Pricing;