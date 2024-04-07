const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

/*
    The only reason this exists is because it is required to have some non-manual way to change rooms
*/

//Add room
router.post("/addRoom", async (req, res) => {
    let {seatAvailability, name} = req.body;

    const newRoom = new Room ({
        seatAvailability, name
    });
    //Checking to see if a room with that name exists
    const roomExists = await Room.exists({name: name});
    if (roomExists){
        return res.json({
            status: "FAILED",
            message: "Room already exists"
        })
    }
    newRoom.save().then(result => {
        return res.json({
            status: "SUCCESS",
            message: "Room added successfully"
        });
    }).catch(err =>{
        return res.json({
            status: "FAILED",
            message: "Room was unable to be created"
        })
    })

})


//Update room
router.post("/updateRoom/:roomName", async (req, res) => {
    let { roomName } = req.params;

    let {seatAvailability, name} = req.body;
    
    const roomUpdates = {};
    if(seatAvailability !== undefined){
        roomUpdates["seatAvailability"] = seatAvailability;
    }
    if(name !== undefined){ 
        roomUpdates["name"] = name;
    }   
    try { 
        //Checking if the room exists
        const roomExists = await Room.exists({ name: roomName });
        
        if (roomExists) {
            const updatedRoom = await Room.findOneAndUpdate( //Updating the room
                { name: roomName },
                { $set:  roomUpdates},
                { new: true }
            );
            return res.json({
                status: "SUCCESS",
                message: "Room updated successfully",
            });
        } else {
            return res.json({
                status: "FAILED",
                message: "Room not found"
            });
        }
    } catch (err) {
        return res.json({
            status: "FAILED",
            message: "Error updating Room: " + err.message
        });
    }


})

module.exports = router;