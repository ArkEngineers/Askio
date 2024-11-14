import Group from "../models/classModel.js";
import User from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

      res
        .status(201)
        .json({ message: "Class created successfully", class: newClass });
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
        return res
          .status(403)
          .json({ error: "Only the faculty can add or update notes" });
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
      const { userEmail } = req.body;
      const userIds = await User.findOne({ email: userEmail }).select("_id");
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }

      // Update the userAdded array in the group
      group.userAdded.push(userIds._id);
      await group.save();

      // Update each user's groupAdded field
      await User.updateMany(
        { _id: { $in: userIds } },
        { $addToSet: { groupAdded: group._id } }
      );

      res
        .status(200)
        .json({ message: "Participants updated successfully", group });
    } catch (error) {
      res.status(500).json({ error: "Error updating participants" });
    }
  }

  // Fetch classes for a specific user
  static async fetchUserClasses(req, res) {
    try {
      const { userEmail } = req.params;

      // Check if user exists
      const userId = await User.findOne({ email: userEmail }).select("_id");
      if (!userId) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log(userId)
      // Find all classes where this user is enrolled
      const userClasses = await Group.find({ userAdded: userId._id })
        .populate("faculty", "name email") // Populate faculty info
        .populate("userAdded", "name email") // Populate enrolled users info
        .populate("quiz", "title"); // Populate quizzes info

      res.status(200).json(userClasses);
    } catch (error) {
      res.status(500).json({ error: "Error fetching user's classes" });
    }
  }
  static async fetchByGroupId(req,res){
    const {groupId}=req.params;
    const group = await Group.findOne({_id:groupId});
    if (!group) {
      return res.status(500).json({error:"Couldn't find group"})
    }
    return res.status(200).json(group);
  
  }

  static async addPDFNoteToGroup(req, res) {
    const { groupId } = req.params;
    const { userEmail, tag } = req.body;
    const facultyId = await User.findOne({ email: userEmail }).select("_id");
    const pdfFile = req.file; // PDF file uploaded

    // Check if the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(500).json({ error: "Couldn't find group" });
    }

    // Check if the authenticated user is the faculty of the group
    // if (group.faculty._id.toString() !== facultyId._id.toString()) {
    //   return res.status(403).json({error:"Only the faculty can add notes"})

    // }
  
    // Verify if PDF file is provided
    if (!pdfFile) {
      return res.status(403).json({ error: "PDF File not found" });
    }

    // Add PDF file path to group's notes (e.g., pdfFile.path if stored locally)
    const groupUrlPath = pdfFile?.path; //path in local server not on cloudinary
    // console.log(req.files)
    if (!groupUrlPath) throw new ApiError(400, "file is required");

    const groupUrl = await uploadOnCloudinary(groupUrlPath);
    if (!groupUrl) throw new ApiError(400, "File not found");
    group.notes.push({
      title:groupUrl.original_filename,
      url: groupUrl.url,
      tag: tag || "untagged", // Default tag if none provided
    });

    // Save updated group
    await group.save();
  
    return res.status(200).json({"url":groupUrl.url});
  };
}

// Controller to add PDF notes to a group (class)

export default ClassController;
