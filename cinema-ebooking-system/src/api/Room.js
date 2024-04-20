const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

/*
    The only reason this exists is because it is required to have some non-manual way to change rooms
*/

//Add room
router.post("/addRoom", async (req, res) => {
    let {seatAvailability, name, totalSeats} = req.body;


    if(seatAvailability > totalSeats || seatAvailability < 0){
        return res.json({
            status: "FAILED",
            message: "Seat Availability must be equal to or less than total seats and greater than 0"
        });
    }


    const newRoom = new Room ({
        seatAvailability, name, totalSeats
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

    let {seatAvailability, name, totalSeats} = req.body;
    
    const roomUpdates = {};

    /*
        SeatAvailbility cannot be greater than totalSeats and must be smaller than 0
    */
    if(seatAvailability !== undefined){
        const room = await Room.findOne({ name: roomName });

        if(seatAvailability < 0 || seatAvailability > room.totalSeats){
            return res.status(400).json({
                status: "FAILED",
                message: "Seat availability must be between 0 and " + room.totalSeats
            });
        }
        roomUpdates["seatAvailability"] = seatAvailability;
    }
    if(name !== undefined){ 
        roomUpdates["name"] = name;
    }   
    if(totalSeats !== undefined){
        roomUpdates["totalSeats"] = totalSeats;
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



/*
    Decrements the seat availability for the room. The reason this exists is soley for when a seat
    gets bought out for this room. 
*/
router.post("/decrementRoomSeat/:roomName", async (req, res) => {
    let { roomName } = req.params;
    
    const room = await Room.findOne({ name: roomName });

    const roomUpdates = {};
    roomUpdates["seatAvailability"] = (room.seatAvailability - 1);

    if(roomUpdates["seatAvailability"] < 0){
        return res.json({
            status: "FAILED",
            message: "All seats are full"
        });
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
                message: "Room seat availability decremented by 1 successfully",
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