import {asyncHandler} from "../utils/asyncHandler.js";
import Group from "../models/classModel.js";
import User from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Create a new class
const createClass = asyncHandler(async (req, res) => {
  const { groupName, facultyId, userIds, notes, quizIds } = req.body;

  // Check if faculty exists
  const faculty = await User.findById(facultyId);
  if (!faculty) throw new ApiError(404, "Faculty not found");

  // Create the class (group) with provided details
  const newClass = await Group.create({
    groupName,
    faculty: facultyId,
    userAdded: userIds || [],
    notes: notes || [],
    quiz: quizIds || [],
  });

  // Add this class to each user's groupAdded array
  await User.updateMany(
    { _id: { $in: userIds } },
    { $push: { groupAdded: newClass._id } }
  );

  return res.status(201).json(new ApiResponse(201, newClass, "Class created successfully"));
});

// Fetch all classes
const fetchAllClasses = asyncHandler(async (req, res) => {
  const classes = await Group.find()
    .populate("faculty", "name email") // Populate faculty with name and email only
    .populate("userAdded", "name email") // Populate enrolled users with name and email
    .populate("quiz", "title"); // Populate quizzes with title only

  return res.status(200).json(new ApiResponse(200, classes, "Classes fetched successfully"));
});

// Fetch classes for a specific user
const fetchUserClasses = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Find all classes where this user is enrolled
  const userClasses = await Group.find({ userAdded: userId })
    .populate("faculty", "name email") // Populate faculty info
    .populate("userAdded", "name email") // Populate enrolled users info
    .populate("quiz", "title"); // Populate quizzes info

  return res.status(200).json(new ApiResponse(200, userClasses, "User's classes fetched successfully"));
});

export { createClass, fetchAllClasses, fetchUserClasses };
