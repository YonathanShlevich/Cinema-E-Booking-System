const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const UserSchema = new Schema({
    firstName: String,
    lastName: String, 
    email: String,
    password: String,
    status: integer,
    type: integer, 
    promo: Boolean
})

const User = mongoose.model('User', UserSchema);

module.exports = User;