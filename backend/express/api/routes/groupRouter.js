import express from "express";
import { createClass, fetchAllClasses, fetchUserClasses } from "../controllers/group.controllers.js";

const GroupRouter = express.Router();

router.post("/", createClass);
router.get("/groups", fetchAllClasses);
router.get("/user/:userId/groups", fetchUserClasses);

export default GroupRouter;
