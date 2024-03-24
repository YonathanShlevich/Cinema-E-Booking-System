const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const UserSchema = new Schema({
    firstName: String,
    lastName: String, 
    email: String,
    password: String,
    phoneNumber: Number,
    status: Number,
    type: Number, 
    promo: Boolean
});

const User = mongoose.model('User', UserSchema);

module.exports = User;