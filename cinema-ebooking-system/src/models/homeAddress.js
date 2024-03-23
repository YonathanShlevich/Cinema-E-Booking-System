const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const homeAddressSchema = new Schema({
    userId: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
});

const User = mongoose.model('homeAddress', homeAddressSchema);

module.exports = User;