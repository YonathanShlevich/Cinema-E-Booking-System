const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Attributes of a User table
const ShowPeriodSchema = new Schema({
    id: String, //pulled from showtime
    time: String //leaving this as string for now, will change based on requirements

});

const ShowPeriod = mongoose.model('ShowPeriod', ShowPeriodSchema);

module.exports = ShowPeriod;