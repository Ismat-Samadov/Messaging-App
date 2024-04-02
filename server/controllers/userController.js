const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const path = require("path");
const fs = require("fs").promises;
const Conversation = require("../models/conversation");

exports.get_users = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;
    // $ne operator means Not Equal
    // Find all users that dont match the req.user.user._id
    const users = await User.find(
      { _id: { $ne: req.user.user._id } },
      "username first_name profile_pic_src"
    )
      .sort({ first_name: 1 })
      .skip(skip)
      .limit(pageSize);

    if (users.length === 0) {
      return res.status(404).json({ message: "There are no users yet." });
    }
    return res.status(200).json({ users: users });
  } catch (err) {
    return next(err);
  }
};

exports.get_user = async (req, res, next) => {
  try {
    const loggedUser = await User.findById(req.user.user._id);

    const user = await User.findById(
      req.params.user_id,
      "username profile_pic_src bio following first_name bio creation utc_creation"
    );

    const existsConversation = await Conversation.findOne({
      participants: {
        $all: [user._id, loggedUser._id],
      },
    });

    if (!user) {
      return res.status(404).json({ errors: "User not found." });
    }
    if (existsConversation) {
      return res
        .status(200)
        .json({ user: user, existsConversation: existsConversation._id });
    }
    return res.status(200).json({ user: user });
  } catch (err) {
    return next(err);
  }
};

exports.post_user = [
  body("username")
    .trim()
    .escape()
    .matches(/^\S+$/)
    .withMessage("Username must be a single word without spaces")
    .isLength({ min: 3 })
    .withMessage("Username must have at least 3 characters.")
    .isLength({ max: 12 })
    .withMessage("Username must have a maximum of 12 characters"),
  body("email").trim().isEmail().escape().withMessage("Email is not valid."),
  body("first_name")
    .trim()
    .escape()
    .matches(/^\S+$/)
    .withMessage("First name must be a single word without spaces")
    .isLength({ min: 1 })
    .withMessage("First name required")
    .isLength({ max: 12 })
    .withMessage("First name must have a maximum of 12 characters"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must have at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .escape(),
  body("password_confirmation")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords didn't match."),

  async (req, res, next) => {
    const errors = validationResult(req);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const usernameLowerCase = await req.body.username.toLowerCase();
    // The variable usernameLowerCase is created to prevent users from creating accounts with the same username
    // despite different cases. This ensures uniqueness and helps prevent user confusion.
    // It stores the lowercase version of the username, which is used for comparison during account creation
    // and validation processes to enforce case-insensitive uniqueness.
    const user = new User({
      username: req.body.username,
      usernameLowerCase: usernameLowerCase,
      email: req.body.email,
      first_name: req.body.first_name,
      password: hashedPassword,
      creation: Date.now(),
    });

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existsUsernameLowerCase = await User.findOne({
      usernameLowerCase: usernameLowerCase,
    });

    // Send the error bellow as an array with a property 'msg' to match the errors.array() passed in line 66.
    // express-validator sends errors as an array, and the withMessage('Email not valid'),
    // is in a property 'msg' inside that array.
    // To be sure that errors are handled in the same way, send all errors equally
    if (existsUsernameLowerCase) {
      return res.status(409).json({
        errors: [
          { msg: "This username already exists, please choose another one." },
        ],
      });
    } else {
      await user.save();
      return res.status(200).json({
        message:
          "You have successfully signed up. Please log in to start using our services",
      });
    }
  },
];

exports.put_user_bio = [
  body("bio")
    .isLength({ max: 65 })
    .withMessage("Bio must have maximum of 65 characters.")
    .isLength({ min: 1 })
    .withMessage("Bio must have at least one character."),

  async (req, res, next) => {
    try {
      const existsUser = await User.findById(req.user.user._id);

      if (!existsUser) {
        return res.status(404).json({ errors: "User not found" });
      }

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
      }

      await User.findByIdAndUpdate(
        req.user.user._id,
        { bio: req.body.bio },
        {}
      );

      return res.status(200).json({
        message: `User ${req.user.user._id} bio was updated to ${req.body.bio} `,
      });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
      return next(err);
    }
  },
];

exports.post_follow = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user._id, "following");

    if (!user) {
      return res.status(404).json({ errors: "User not found." });
    }

    const followedUser = await User.findById(
      req.params.followed_user_id,
      "username"
    );

    if (!followedUser) {
      return res.status(404).json({ errors: "Followed user not found." });
    }

    const alreadyFollowing = user.following.includes(
      req.params.followed_user_id
    );

    if (alreadyFollowing) {
      return res.status(409).json({ errors: "User already followed." });
    }

    user.following.push(req.params.followed_user_id);

    await user.save();

    return res.status(200).json({
      message: `You are now following ${followedUser.username}`,
      following: user.following,
    });
  } catch (err) {
    return next(err);
  }
};

exports.delete_follow = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user._id, "following");

    if (!user) {
      return res.status(404).json({ errors: "User not found." });
    }

    const followedUser = await User.findById(
      req.params.followed_user_id,
      "username"
    );

    if (!followedUser) {
      return res.status(404).json({ errors: "Followed user not found." });
    }

    const alreadyFollowing = user.following.includes(
      req.params.followed_user_id
    );

    if (!alreadyFollowing) {
      return res
        .status(409)
        .json({ errors: "You can't unfollow a user that you don't follow." });
    }

    const followedUserIndex = user.following.indexOf(
      req.params.followed_user_id
    );

    user.following.splice(followedUserIndex, 1);

    await user.save();

    return res.status(200).json({
      message: `You unfollowed ${followedUser.username}`,
      following: user.following,
    });
  } catch (err) {
    return next(err);
  }
};

exports.get_self = async (req, res, next) => {
  try {
    const user = await User.findById(
      req.user.user._id,
      "username email first_name bio profile_pic_src following"
    ).populate({
      path: "following",
      select: "username profile_pic_src first_name",
    });

    return res.status(200).json({ user: user });
  } catch (err) {
    return res.status(404).json({ errors: "User not found" });
  }
};

exports.get_followings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user._id, "following").populate({
      path: "following",
      select: "username profile_pic_src",
    });

    return res.status(200).json({ userFollowings: user.following });
  } catch (err) {
    return res.status(404).json({ errors: "Internal Server error" });
  }
};

exports.put_profile_pic = async (req, res, next) => {
  try {
    if (!req.file.filename) {
      return res.status(500).json({ errors: "Need to be an image" });
    }

    if (req.file.size > 1024 * 1024 * 2) {
      return res
        .status(400)
        .json({ errors: "File size exceeds the limit of 2 MB" });
    }

    const imgData = await fs.readFile(
      path.join(__dirname, "../images", req.file.filename)
    );

    const base64Img = Buffer.from(imgData).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64Img}`;

    const user = await User.findById(req.user.user._id);

    await User.findByIdAndUpdate(user._id, { profile_pic_src: dataURI }, {});

    return res
      .status(200)
      .json({ message: "You've sucessfully changed your profile pic..." });
  } catch (err) {
    return next(err);
  }
};
