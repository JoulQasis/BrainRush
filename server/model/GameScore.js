const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameScore = new Schema({

    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: false
    },
    gamename: {
        type: String,
        required: true,
    },
    score: {
        type: String,
    },
    level: {
        type: Number,
    },
    timer: {
        type: String,
    }
});


module.exports = mongoose.model('GameScore', GameScore);

// users
