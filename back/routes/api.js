var express = require("express");
var router = express.Router();
const userRouter = require("./user");
const loginRouter = require("./login");
const conversationRouter = require("./conversation");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).json({ message: "API Route" });
});

router.use("/users", userRouter);
router.use("/login", loginRouter);
router.use("/conversation", conversationRouter);

module.exports = router;
