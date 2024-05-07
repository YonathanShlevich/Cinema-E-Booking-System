const express = require('express');
const router = express.Router();
const Pricing = require('../models/Pricing');

//Adding the one pricings model
router.post("/addPricing", async (req, res) => {

    const pricingChecks = await Pricing.exists();
    if (pricingChecks) {
        return res.json({
            status: "FAILED",
            message: "Pricing data already exists"
        });
    }

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

//Adding the one pricings model
router.post("/updatePricing", async (req, res) => {
    let { childCost, adultCost, seniorCost, bookingFee } = req.body;


    const pricingUpdates = {};
    if( childCost !== undefined){ pricingUpdates["childCost"] = childCost}; 
    if( adultCost !== undefined){ pricingUpdates["adultCost"] = adultCost}; 
    if( seniorCost !== undefined){ pricingUpdates["seniorCost"] = seniorCost}; 
    if( bookingFee !== undefined){ pricingUpdates["bookingFee"] = bookingFee}; 

    console.log(pricingUpdates)
    //Just to pull from currently existing pricing chart without any ID
    const pricingChecks = await Pricing.exists();
    console.log(pricingChecks._id)
    //Checking if the body has the pricings
    const updatedPricing = await Pricing.findOneAndUpdate( //Updating the room
                { _id: pricingChecks._id },
                { $set:  pricingUpdates},
                { new: true }
            );
    return res.json({
        status: "SUCCESS",
        message: "Pricing Chart was updated!"
    });
});





//Pull Pricings
router.get("/pullPricings", async(req, res) =>{
    try {
        const pricingExists = await Pricing.exists();
        if (!pricingExists) {
            return res.json({
                status: "FAILED",
                message: 'Pricing data does not exist'
            });
        }
        
        const pricingData = await Pricing.findOne(); // Find the first document in the Pricing collection
        return res.json({
            status: "SUCCESS",
            data: pricingData
        });
        
    } catch (error) {
        console.error("Error pulling pricing data:", error);
        return res.json({
            status: "FAILED",
            message: "An error occurred while pulling pricing data"
        });
    }

})






module.exports = router;