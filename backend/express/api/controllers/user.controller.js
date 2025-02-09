import User from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const updateGroup = asyncHandler(async (req, res) => {
    try {
        const { email, groupId } = req.body;
        console.log(email, groupId);

        if (!email || !groupId) {
            throw new ApiError(400, "Email and groupId are required");
        }

        const currentUser = await User.findOneAndUpdate(
            { email },
            { $push: { groupAdded: groupId } },
            { new: true }
        );

        if (!currentUser) {
            throw new ApiError(404, "User not found");
        }

        return res.status(200).json(new ApiResponse(200, currentUser, "Updated Group of Current User"));
    } catch (error) {
        console.error("Error updating group:", error); // Log the actual error
        throw new ApiError(500, "Couldn't update Group of current user");
    }
});
