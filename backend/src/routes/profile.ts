import express from "express";
import { User } from "../models/userModel.js";
import { isEditValid } from "../utils/validation.js";

const profileRouter = express.Router();

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

profileRouter.get("/profile/view", async (req, res) => {
  // Can also be taken as params like /profile/view/:email, where email can be get by {email} = req.params;
  // taking email as query which will be present in the requested url
  try {
    const loggedInUserId = req.user;

    const user = await User.findById(loggedInUserId).lean().select("-password");

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    return res
      .status(200)
      .json({ message: "User profile details fetched successfully", user });
  } catch (error: any) {
    return res.status(500).json({
      message:
        error instanceof Error
          ? "ERROR: " + error.message
          : "ERROR: Something went wrong",
    });
  }
});

profileRouter.patch("/profile/edit", async (req, res) => {
  try {
    const loggedInUserId = req.user;

    const edits = req.body;

    if (!isEditValid(edits)) throw new Error("Invalid edit request");

    const loggedInUser = await User.findById(loggedInUserId);

    if (!loggedInUser) throw new Error("No User found");

    Object.keys(edits).forEach((key) => {
      (loggedInUser as any)[key] = edits[key];
    });

    await loggedInUser.save();

    return res.status(200).json({
      message: `${loggedInUser.firstName}, Your profile has been updated successfully`,
      user: loggedInUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: "ERROR : " + error.message });
    } else {
      return res.status(500).json({ message: "ERROR : Something went wrong" });
    }
  }
});

export default profileRouter;
