//requires our MongoDB
require('./db_config/db');
require('./api/User');
const app = require('express')();
const port = 3000;

const UseRouter = require('./api/User');

//Accepts post data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UseRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})