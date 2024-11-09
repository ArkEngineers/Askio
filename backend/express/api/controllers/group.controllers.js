import Group from "../models/classModel.js";
import User from "../models/userModel.js";

class ClassController {
  
  // Create a new class
  static async createClass(req, res) {
    try {
      const { groupName, facultyId, userIds, notes, quizIds } = req.body;

      // Check if faculty exists
      const faculty = await User.findById(facultyId);
      if (!faculty) {
        return res.status(404).json({ error: "Faculty not found" });
      }

      // Create the class (group) with provided details
      const newClass = new Group({
        groupName,
        faculty: facultyId,
        userAdded: userIds || [],
        notes: notes || [],
        quiz: quizIds || [],
      });

      // Save the class
      await newClass.save();

      // Add this class to each user's groupAdded array
      await User.updateMany(
        { _id: { $in: userIds } },
        { $push: { groupAdded: newClass._id } }
      );

      res.status(201).json({ message: "Class created successfully", class: newClass });
    } catch (error) {
      res.status(500).json({ error: "Error creating class" });
    }
  }

  // Fetch all classes
  static async fetchAllClasses(req, res) {
    try {
      const classes = await Group.find()
        .populate("faculty", "name email") // Populate faculty with name and email only
        .populate("userAdded", "name email") // Populate enrolled users with name and email
        .populate("quiz", "title"); // Populate quizzes with title only

      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ error: "Error fetching classes" });
    }
  }

  // Fetch classes for a specific user
  static async fetchUserClasses(req, res) {
    try {
      const userId = req.params.userId;

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find all classes where this user is enrolled
      const userClasses = await Group.find({ userAdded: userId })
        .populate("faculty", "name email") // Populate faculty info
        .populate("userAdded", "name email") // Populate enrolled users info
        .populate("quiz", "title"); // Populate quizzes info

      res.status(200).json(userClasses);
    } catch (error) {
      res.status(500).json({ error: "Error fetching user's classes" });
    }
  }
}

export default ClassController;
