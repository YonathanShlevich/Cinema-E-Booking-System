const express = require('express');
const router = express.Router();
const PaymentCard = require('../models/paymentCard');
const bcrypt = require('bcrypt');

router.post("/addCard", async (req, res) => {
    console.log("adding a card");
    //const { userId } = req.params;
    
    try {
        /*
        // Check if the user already has three or more cards
        const cardCount = await paymentCard.countDocuments({ userId: userId });
        if (cardCount >= 3) {
            return res.json({
                status: "FAILED",
                message: "You have already reached the maximum number of cards (3)"
            });
        }
        */

        let { userId, cardType, expDate, cardNumber, billingAddr, billingCity, billingState, billingZip } = req.body;

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

        // done with checking, time to add a card brother
        /*
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.json({
                status: "FAILED",
                message: "User not found"
            });
        }
        */
        console.log(cardNumber);
        const lastFourDigits = cardNumber.slice(-4);
        // Hash everything except the last 4 digits
        const hashedPortion = bcrypt.hashSync(cardNumber.slice(0, -4), 10); // Adjust the salt rounds as needed
        // Concatenate the hashed portion with the last 4 digits
        const hashedCreditCard = hashedPortion + lastFourDigits;
        
        const newPaymentCard = new PaymentCard({
            userId,
            cardType,
            expDate,
            cardNumber: hashedCreditCard,
            billingAddr,
            billingCity,
            billingState,
            billingZip
        });
        await newPaymentCard.save();
        //sendProfileUpdatedEmail(userId);
        res.json({
            status: "SUCCESS",
            message: "Card successfully added"
        });
    } catch (error) {
        console.error("Error adding card:", error);
        res.json({
            status: "FAILED",
            message: "An error occurred while adding the payment card"
        });
    }
});

module.exports = router;