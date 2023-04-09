const express = require('express');
const mongoose = require('mongoose')
const router = require('./routes/user-routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config();
// functionality of the app
const app = express();
app.use(cors({ credentials: true, origin: "http://BrainRush.onrender.com" }));
app.use(cookieParser());
app.use(express.json());
app.use('/api', router);

// password  KVMPKJFfq8KwvDBb
// connect to database if successfull app.listen port 5000!
mongoose.connect(`mongodb+srv://BrainRushGames:${process.env.MONGODB_PASSWORD}@brainrush-cluster.4qfwa0t.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(5000);
        console.log('Database is connected! Listening to localhost 5000!')
    }).catch((err) => console.log(err));
// middlewear

module.exports = router;


