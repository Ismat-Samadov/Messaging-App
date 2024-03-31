import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ msg: "unauthorized request" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?._id).select("-password");
    if (!user) return res.status(401).json({ msg: "Invalid token" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
});
