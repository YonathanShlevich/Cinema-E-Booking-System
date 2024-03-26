const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ShowPeriod = require('./ShowPeriod');

//Attributes of a User table
const ShowPeriodSchema = new Schema({
    id: Number,
    time: String //leaving this as string for now, will change based on requirements

});

const ShowPeriod = mongoose.model('ShowPeriod', ShowPeriodSchema);

module.exports = ShowPeriod;