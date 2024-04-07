const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const RoomSchema = new Schema({
    seatAvailability: Number, //# of seats
    name: String
    
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;