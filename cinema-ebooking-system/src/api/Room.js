const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

/*
    The only reason this exists is because it is required to have some non-manual way to change rooms
*/

//Add room
router.post("/addRoom", async (req, res) => {
    let {seatAvailability, name, totalSeats} = req.body;


    if(seatAvailability !== totalSeats){
        return res.json({
            status: "FAILED",
            message: "Seat Availability must be equal to Total Seats"
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
    

    newRoom.save()
        .then(result => {
            return res.json({
                status: "SUCCESS",
                message: "Room added successfully"
            });
        })
        .catch(err => {
            console.log(err);
            return res.json({
                status: "FAILED",
                message: "Room was unable to be created"
            });
        });

})


//Update room
/*
    This is how we update the seat 
*/
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

    When this function is called, it takes in the roomName as well as an array of seats bought.
    We will then update that many seats and if even one breaks, we cancel the whole order.
*/
router.post("/decrementRoomSeat/:roomName", async (req, res) => {
    let { roomName } = req.params;
    let { seatsBought } = req.body;
    const room = await Room.findOne({ name: roomName });

    //Checking length of seatsBought array 
    let numberOfSeats = seatsBought.length;

    const roomUpdates = {};
    //Checks if the amount of seats taken is more than allotted 
    roomUpdates["seatAvailability"] = (room.seatAvailability - numberOfSeats);
    if(roomUpdates["seatAvailability"] < 0){
        return res.json({
            status: "FAILED",
            message: "You've picked more seats than are available"
        });
    }


    /*
        Now we are going to check if those seats are available
        Then we will use a for loop to create an array of seatObjects and once 
    */

    try { 
        //Checking if the room exists
        const roomExists = await Room.exists({ name: roomName });
        
        if (roomExists) {
            const updatedRoom = await Room.findOneAndUpdate( //Updating the room
                { name: roomName },
                { $set:  roomUpdates},
                { new: true }
            );

            /*
                Here's how we will update the room seats 
            */


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

//Daniel edits:
//GET function to pull all rooms
router.get("/allRooms", (req, res) =>{
    
    Room.find({})
        .then(result => {
            
            if(!result){ //If the userID doesn't exist
                //console.log('empty req')
                return res.json({
                    status: "FAILED",
                    message: 'Room does not exist'
                });
            }   
            return res.json(result); //This just returns the full json of the items in the User
        }).catch(error =>{
            //console.log(`Error: ${error}`);
            return res.json({
                status: "FAILED",
                message: 'Error with pulling data'
            });
        })
})




module.exports = router;