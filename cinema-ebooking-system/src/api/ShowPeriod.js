const express = require('express');
const router = express.Router();
const ShowPeriod = require('../models/ShowPeriod');

/*
    We need a way to make showPeriods, this is it
*/

//Add showPeriod
router.post("/addPeriod", async (req, res) => {
    let {time} = req.body;

    const newPeriod = new ShowPeriod ({
        time
    });
    //Checking to see if a room with that  exists
    const periodExists = await ShowPeriod.exists({time: time});
    if (periodExists){
        return res.json({
            status: "FAILED",
            message: "ShowPeriod already exists"
        })
    }
    newPeriod.save().then(result => {
        return res.json({
            status: "SUCCESS",
            message: "ShowPeriod added successfully"
        });
    }).catch(err =>{
        return res.json({
            status: "FAILED",
            message: "ShowPeriod was unable to be created"
        })
    })

})


//Update room
router.post("/updatePeriod/:showPeriod", async (req, res) => {
    let { showPeriod } = req.params;

    let { time } = req.body;
    
    const periodUpdates = {};
    if(time !== undefined){
        periodUpdates["time"] = time;
    } else {
        return res.json({
            status: "FAILED",
            message: "Time cannot be empty"
        });
    }
    try { 
        //Checking if the room exists
        const periodExists = await ShowPeriod.exists({ time: showPeriod });
        
        if (periodExists) {
            const updatedPeriod = await ShowPeriod.findOneAndUpdate( //Updating the room
                { time : showPeriod },
                { $set:  periodUpdates},
                { new: true }
            );
            return res.json({
                status: "SUCCESS",
                message: "ShowPeriod updated successfully",
            });
        } else {
            return res.json({
                status: "FAILED",
                message: "ShowPeriod not found"
            });
        }
    } catch (err) {
        return res.json({
            status: "FAILED",
            message: "Error updating ShowPeriod: " + err.message
        });
    }


})



module.exports = router;