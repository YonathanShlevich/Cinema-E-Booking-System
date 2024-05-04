const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const RoomSchema = new Schema({
    seatAvailability: Number, //# of seats remaining
    name: String,
    totalSeats: Number, //The total # of seats
    seats: [{type: String}] // Array of seats
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;