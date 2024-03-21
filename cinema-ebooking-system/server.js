//requires our MongoDB
require('./src/db_config/db');

const app = require('express')();
const port = 3000;

const UseRouter = require('./api/User');

//Accepts post data
const bodyParser = require('express').json;
app.use(bodyParser());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})