//requires our MongoDB
require('./db_config/db');
require('./api/User');
require('./api/Movie');
require('./api/Room');
require('./api/ShowTime');
require('./api/Movie');
require('./api/Room');
require('./api/ShowTime');
const app = require('express')();
const port = 4000;
const port = 4000;

const UseRouter = require('./api/User');
const MovieRouter = require('./api/Movie');
const RoomRouter = require('./api/Room');
const ShowPeriodRouter = require('./api/ShowPeriod');
const ShowTimeRouter = require('./api/ShowTime');
const SeatRouter = require('./api/Seat');
const PromotionRouter = require('./api/Promotion');

//Adding CORS
let cors = require("cors");
//app.use(cors());
//app.use(cors());
app.use(cors());
//Accepts post data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UseRouter);
app.use('/movie', MovieRouter);
app.use('/room', RoomRouter);
app.use('/showperiod', ShowPeriodRouter);
app.use('/showtime', ShowTimeRouter);
app.use('/seat', SeatRouter);
app.use('/promotion', PromotionRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})