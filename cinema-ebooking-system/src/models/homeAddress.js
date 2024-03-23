const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const homeAddressSchema = new Schema({
    userId: String,
    homeAddr: String,
    homeCity: String,
    homeState: String,
    homeZip: Number,
});

const User = mongoose.model('homeAddress', homeAddressSchema);

module.exports = User;