const express = require('express');
const router = express.Router();
const PaymentCard = require('../models/paymentCard');
const bcrypt = require('bcrypt');

router.post("/addCard", async (req, res) => {
    console.log("adding a card");
    
    try {
        let {cardType, expDate, cardNumber, billingAddr, billingCity, billingState, billingZip } = req.body;

        const attributes = [
            { name: 'cardType', value: cardType, pattern: /^.{1,}$/, errMessage: 'Invalid cardType', required: true },
            { name: 'expDate', value: expDate, pattern: /^.{1,}$/, errMessage: 'Invalid expDate', required: true },
            { name: 'cardNumber', value: cardNumber, pattern: /^.{10}$/, errMessage: 'Invalid cardNumber', required: true },
            { name: 'billingAddr', value: billingAddr, pattern: /^[1-9][0-9]*[ ]+[a-zA-Z ]+$/, errMessage: 'Invalid billingAddr', required: true },
            { name: 'billingCity', value: billingCity, pattern: /^[a-zA-z ]+$/, errMessage: 'Invalid billingCity', required: true },
            { name: 'billingState', value: billingState, pattern: /^.{1,}$/, errMessage: 'Invalid billingState', required: true },
            { name: 'billingZip', value: billingZip, pattern: /^(?=(?:.{5}|.{9})$)[0-9]*$/, errMessage: 'Invalid billingZip', required: true }
        ];
        for (const attribute of attributes) {
            if (typeof attribute.value === 'string') {
                attribute.value = attribute.value.trim(); //Trimming all the attributes
            }
            //Checks if an attribute is empty
            if (!attribute.value) {
                if (attribute.required) { //If required
                    console.log(attribute.name + " is required");
                    return res.json({
                        status: "FAILED",
                        message: 'Empty input fields, please enter ' + attribute.name,
                    });
                }
            } else if (attribute.pattern && !attribute.pattern.test(attribute.value)) {
                console.log("Doesn't meet regex");
                return res.json({
                    status: 'FAILED',
                    message: attribute.errMessage,
                });
            }
        }

        console.log(cardNumber);
        const lastFourDigits = cardNumber.slice(-4);
        // Hash everything except the last 4 digits
        const hashedPortion = bcrypt.hashSync(cardNumber.slice(0, -4), 10); // Adjust the salt rounds as needed
        // Concatenate the hashed portion with the last 4 digits
        const hashedCreditCard = hashedPortion + lastFourDigits;
        
        const newPaymentCard = new PaymentCard({
            cardType,
            expDate,
            cardNumber: hashedCreditCard,
            billingAddr,
            billingCity,
            billingState,
            billingZip
        });
        await newPaymentCard.save()
        .then(result => {
            
            if(!result){ //If the userID doesn't exist
                //console.log('empty req')
                return res.json({
                    status: "FAILED",
                    message: 'Show period does not exist'
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
    } catch (error) {
        console.error("Error adding card:", error);
        res.json({
            status: "FAILED",
            message: "An error occurred while adding the payment card"
        });
    }
    
});

module.exports = router;