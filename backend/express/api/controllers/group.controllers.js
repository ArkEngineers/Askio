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
  // Update notes in a class (only accessible by faculty)
  static async updateNotes(req, res) {
    try {
      const { groupId } = req.params;
      const { notes } = req.body;
      const userId = req.user._id; // Assuming `req.user` contains the authenticated user's ID

      // Find the group
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }

      // Check if the user is the faculty of the group
      if (String(group.faculty) !== String(userId)) {
        return res.status(403).json({ error: "Only the faculty can add or update notes" });
      }

      // Update the notes array
      group.notes = notes;
      await group.save();

      res.status(200).json({ message: "Notes updated successfully", group });
    } catch (error) {
      res.status(500).json({ error: "Error updating notes" });
    }
  }
  // Update quizzes in a class
  static async updateQuiz(req, res) {
    try {
      const { groupId } = req.params;
      const { quizIds } = req.body;

      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }

      // Update the quizzes array in the group
      group.quiz = quizIds;
      await group.save();

      res.status(200).json({ message: "Quizzes updated successfully", group });
    } catch (error) {
      res.status(500).json({ error: "Error updating quizzes" });
    }
  }

  // Update participants in a class
  static async updateParticipants(req, res) {
    try {
      const { groupId } = req.params;
      const { userIds } = req.body;

      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }

      // Update the userAdded array in the group
      group.userAdded = userIds;
      await group.save();

      // Update each user's groupAdded field
      await User.updateMany(
        { _id: { $in: userIds } },
        { $addToSet: { groupAdded: group._id } }
      );

      res.status(200).json({ message: "Participants updated successfully", group });
    } catch (error) {
      res.status(500).json({ error: "Error updating participants" });
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
