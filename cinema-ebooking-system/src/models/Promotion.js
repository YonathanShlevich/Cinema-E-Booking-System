const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const PromotionSchema = new Schema({
    code: Number, //promo code
    start: Date, //start of coupon
    end: Date,  //end of coupon
    discount: Number //should be entered as a number(ex: 50% off = 50)

});

const Promotion = mongoose.model('Promotion', PromotionSchema);

module.exports = Promotion;