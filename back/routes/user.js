const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

router.get("/", isAuthenticated, userController.get_users);

router.post("/", userController.post_user);

router.put("/bio", isAuthenticated, userController.put_user_bio);

router.post(
  "/follow/:followed_user_id",
  isAuthenticated,
  userController.post_follow
);

router.delete(
  "/follow/:followed_user_id",
  isAuthenticated,
  userController.delete_follow
);

router.get("/self", isAuthenticated, userController.get_self);

// all followers
router.get("/followings", isAuthenticated, userController.get_followings);

router.put(
  "/profile_pic",
  isAuthenticated,
  upload.single("img"),
  userController.put_profile_pic
);

router.get("/:user_id", isAuthenticated, userController.get_user);

module.exports = router;
