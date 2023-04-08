const express = require("express");
const {
  signup,
  login,
  verifyToken,
  getUser,
  createGameScore,
  updateGameScore,
  getGameScore,
  getGameScore2,
  updateGameScore2,
} = require("../controllers/user-controller");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.post("/game", createGameScore);
router.patch("/oldgame/:id", updateGameScore);
router.patch("/memorymatch/:id", updateGameScore2);
router.get("/game/:userId/:gamename/:level", getGameScore);
router.get("/game/:userId/:gamename", getGameScore2);

module.exports = router;
