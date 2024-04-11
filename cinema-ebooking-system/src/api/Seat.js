const express = require('express');
const router = express.Router();
const Room = require('../models/Seat');

/*
    Seats should not be created and/or destroyed often. The main action purpose of this 
    file is to update their availability. 
*/


//API to create a seat
router.post("/addSeat", async (req, res) => {

    let {  } = req.body; 

})




module.exports = router;