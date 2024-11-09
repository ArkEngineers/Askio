import express from "express";
// import authController from "../controllers/auth.controllers";
import authController from "../controllers/auth.controllers.js";
import googleAuth from "../controllers/auth.controllers.js";

const Router = express.Router();

Router.get("/google", googleAuth);

export default Router;
