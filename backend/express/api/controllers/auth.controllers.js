// Import dependencies and modules
import axios from "axios";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import oauth2Client from "../utils/oauth2client.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/userModel.js";
import moment from "moment";
import { log } from "console";

// Sign token function
const signToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

// Create and send cookie function
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: moment().add(1, "d").toDate(),
    httpOnly: true,
    // path: "/",
    secure: true,
    // secure: process.env.NODE_ENV === "production",
    // sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
  };

  user.password = undefined;

  //   res.cookie("jwt", token, cookieOptions);
  console.log(token);

  res.status(200).cookie("jwt", token, cookieOptions).json({
    message: "success",
    token,
    data: {
      user,
    },
  });
};

// Google Authentication handler
const googleAuth = asyncHandler(async (req, res, next) => {
  const code = req.query.code;
  console.log("USER CREDENTIAL -> ", code);

  const googleRes = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(googleRes.tokens);

  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
  );

  let user = await User.findOne({ email: userRes.data.email });

  if (!user) {
    console.log("New User found");
    user = await User.create({
      name: userRes.data.name,
      email: userRes.data.email,
      image: userRes.data.picture,
    });
  }

  createSendToken(user, 201, res);
});

export default googleAuth;
