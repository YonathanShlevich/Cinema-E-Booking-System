require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, }).then(() => {
    console.log("Connected the DB");
}).catch((error) => console.log(error));