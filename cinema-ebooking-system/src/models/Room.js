const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const RoomSchema = new Schema({
    id: String, //Pulled from Room
    seatAvailability: Number, //# of seats
    name: String // from 
    
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;