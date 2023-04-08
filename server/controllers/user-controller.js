const User = require("../model/User.js")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const GameScore = require('../model/GameScore.js')

const updateGameScore = async (req, res) => {
    const id = req.params.id
    const { score, timer, level } = req.body
    let updatedScore;
    try {

        updatedScore = await GameScore.findOneAndUpdate({_id: id, level: level }, {
            score, 
            timer,
            level,
        }, {new: true});
    } catch (err) {
        console.log(err);
      }
      if (!updatedScore) {
        return res.status(404).json({ message: "Unable To Update By this ID" });
      }
      return res.status(200).json({ updatedScore });

}
const updateGameScore2 = async (req, res) => {
    const id = req.params.id
    const { score, timer, level } = req.body
    let updatedScore;
    try {

        updatedScore = await GameScore.findOneAndUpdate({_id: id, level: level }, {
            score, 
            timer,
        }, {new: true});
    } catch (err) {
        console.log(err);
      }
      if (!updatedScore) {
        return res.status(404).json({ message: "Unable To Update By this ID" });
      }
      return res.status(200).json({ updatedScore });

}


const getGameScore = async (req, res) => {
    try {
        const { userId, gamename, level } = req.params;
        const gameScore = await GameScore.findOne({ userId: userId, gamename: gamename, level: level });
        res.status(200).json(gameScore);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
const getGameScore2 = async (req, res) => {
    try {
        const { userId, gamename } = req.params;
        const gameScore = await GameScore.findOne({ userId: userId, gamename: gamename });
        res.status(200).json(gameScore);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

const createGameScore = async (req, res) => {

    const { userId, username,level, gamename, score, timer } = req.body
    const gamescore = new GameScore({
        userId,
        username,
        gamename,
        score,
        level,
        timer,
    });
    try {
        await gamescore.save();
    } catch (err) {
        console.log(err)
    }

    return res.status(201).json({ message: gamescore })
}



const signup = async (req, res, next) => {

    // so we dont have to write every time , name: req.body.name ...
    const { name, username, password } = req.body;

    //validation of the user
    let existingUser;
    try {
        existingUser = await User.findOne({ username: username });
    } catch (err) {
        console.log(err)
    }
    if (existingUser) {
        return res.status(400).json({ message: "username already exists! Go login instead!" })
    }


    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({
        name,
        username,
        password: hashedPassword,
    });

    try {
        await user.save();
    } catch (err) {
        console.log(err)
    }

    return res.status(201).json({ message: user })
};

const login = async (req, res, next) => {
    const { username, password } = req.body;

    let existingUser;
    try {

        existingUser = await User.findOne({ username: username });
    } catch (err) {
        return new Error(err)
    }
    if (!existingUser) {
        return res.status(400).json({ message: "User not found! go sign up please!" })
    }
    // to compare the existing user password and the one that the user entered !
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "invalid username/password!" })
    }
    // , secret key
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "2h"
    })

    return res.status(200).json({ message: " Successfully Logged in !", user: existingUser, token })
}
const verifyToken = (req, res, next) => {

    const headers= req.headers[`authorization`]
    const token = headers.split(" ")[1];
    console.log(headers)
    console.log("token")
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: "no token found" })
    }
    jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(400).json({ message: "Invalid token" })
        }
        req.id = user.id;

    })
    next();
};


const getUser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId, "-password")
    } catch (err) {
        return new Error(err)
    }
    if (!user) {
        return res.status(404).json({ message: "User not found!" })
    }
    return res.status(200).json({ user })
};



exports.createGameScore = createGameScore;
exports.updateGameScore = updateGameScore;
exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.getGameScore = getGameScore;
exports.getGameScore2 = getGameScore2;
exports.updateGameScore2 = updateGameScore2;