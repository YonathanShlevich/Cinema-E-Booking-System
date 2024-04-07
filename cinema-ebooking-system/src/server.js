//requires our MongoDB
require('./db_config/db');
require('./api/User');
require('./api/Movie');
require('./api/Room');
const app = require('express')();
const port = 4000;

const UseRouter = require('./api/User');
const MovieRouter = require('./api/Movie');
const RoomRouter = require('./api/Room');

//Adding CORS
let cors = require("cors");
//app.use(cors());
app.use(cors());
//Accepts post data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UseRouter);
app.use('/movie', MovieRouter);
app.use('/room', RoomRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})