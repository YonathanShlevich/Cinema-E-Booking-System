const express = require('express');
const router = express.Router();
const Pricing = require('../models/Pricing');

//Adding the one pricings model
router.post("/addPricing", async (req, res) => {

    let { childCost, adultCost, seniorCost, bookingFee } = req.body;

    //Checking if the body has the pricings
    if(!childCost || !adultCost || !seniorCost || !bookingFee){
        return res.json({
            status: 'FAILED',
            message: 'A price is missing'
        });
    }

    //Checking if entered attrs are numbers
    if(typeof childCost === 'number' && typeof adultCost === 'number' && typeof seniorCost === 'number' && typeof bookingFee === 'number'){
        //empty
    } else {
        return res.json({
            status: 'FAILED',
            message: 'An entered price(s) are not numbers'
        });
    }

    const newPricing = new Pricing({
        childCost: childCost,  
        adultCost: adultCost,  
        seniorCost: seniorCost, 
        bookingFee: bookingFee
    });
    
    await newPricing.save().then(result => {
        return res.json({
            status: "SUCCESS",
            message: "New Pricing Chart was created!"
        });
    }).catch(err => {
        return res.json({
            status: "FAILED",
            message: "Pricing Chart could not be created: ",
            error: err.message
        });
    })
})

module.exports = router;