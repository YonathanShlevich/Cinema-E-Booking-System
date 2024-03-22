const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a UserStatus table
//This is the enurmation that says whether a user is ...
// 1 -> Active
// 2 -> Inactive
// 3 -> Suspended
const UserStatusSchema = new Schema({
    userId: String,
    uniqueString: String,
    creationDate: Date,
    expiresAt: Date,
});

const User = mongoose.model('UserStatus', UserStatusSchema);

module.exports = User;