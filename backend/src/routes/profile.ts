import express, { Request, Response } from "express";
import { User } from "../models/userModel.js";
import { isEditValid } from "../utils/validation.js";
import mongoose from "mongoose";
import { ConnectionReqModel } from "../models/connectionReqModel.js";

const profileRouter = express.Router();

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}
// View profile of logged in user or other users by their userId
profileRouter.get(
  "/profile/view/:userId?",
  async (req: Request, res: Response) => {
    // Can also be taken as params like /profile/view/:email, where email can be get by {email} = req.params;
    // taking email as query which will be present in the requested url
    try {
      const loggedInUserId = req.user;

      const { userId } = req.params;

      if (!loggedInUserId || !mongoose.Types.ObjectId.isValid(loggedInUserId)) {
        res.status(400).json({
          message:
            "You're not logged in or invalid User ID, Please log in again.",
        });
        return;
      }

      let connectionStatus = "own_profile";

      if (!userId || userId === loggedInUserId) {
        const loggedInUserProfile = await User.findById(loggedInUserId).lean();

        if (!loggedInUserProfile) {
          res.status(404).json({ message: "No Profile details found" });
          return;
        }

        const profileWithConnStatus = {
          ...loggedInUserProfile,
          connectionStatus,
        };

        res.status(200).json({
          message: "User profile details fetched successfully",
          user: profileWithConnStatus,
        });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Invalid User ID" });
        return;
      }

      const today = new Date().toDateString();

      await User.updateOne(
        {
          _id: userId, // profile owner
          [`lastViewedBy.${loggedInUserId}`]: { $ne: today }, // not viewed today
          $expr: { $ne: ["$_id", loggedInUserId] }, // prevent self-view
          // $expr tells MongoDB: Evaluate this expression using document fields at runtime
        },
        {
          $inc: { profileViews: 1 },
          $set: { [`lastViewedBy.${loggedInUserId}`]: today },
          $addToSet: { profileViewers: loggedInUserId },
        },
      );

      const userProfile = await User.findById(userId).lean();
      // When used .lean()
      // You can modify the object in memory, but MongoDB will NOT be updated as it bypasses Mongoose document methods and gives you plain JavaScript objects.

      if (!userProfile) {
        res.status(404).json({ message: "No Profile details found" });
        return;
      }

      const loggedInUserConnections = await ConnectionReqModel.find({
        $and: [
          {
            $or: [
              { fromUserId: loggedInUserId, status: "accepted" },
              { toUserId: loggedInUserId, status: "accepted" },
            ],
          },
          {
            $nor: [{ fromUserId: userId }, { toUserId: userId }],
          },
        ],
      }).select("fromUserId toUserId");

      const otherUserConnections = await ConnectionReqModel.find({
        $and: [
          {
            $or: [
              { fromUserId: userId, status: "accepted" },
              { toUserId: userId, status: "accepted" },
            ],
          },
          {
            $nor: [
              { fromUserId: loggedInUserId },
              { toUserId: loggedInUserId },
            ],
          },
        ],
      }).select("fromUserId toUserId");

      const filteredLoggedInUserConnections = loggedInUserConnections.map(
        (connection) => {
          if (connection.fromUserId.toString() === loggedInUserId)
            return connection.toUserId.toString();
          else return connection.fromUserId.toString();
        },
      );

      const filteredOtherUserConnections = otherUserConnections.map(
        (connection) => {
          if (connection.fromUserId.toString() === userId)
            return connection.toUserId.toString();
          else return connection.fromUserId.toString();
        },
      );

      const mutualConnections = filteredLoggedInUserConnections.filter(
        (value) => filteredOtherUserConnections.includes(value),
      );

      const userProfileWithMutualConnections = {
        ...userProfile,
        mutualConnections: mutualConnections.length,
      };

      const connectionRequest = await ConnectionReqModel.findOne({
        $or: [
          { fromUserId: loggedInUserId, toUserId: userId },
          { fromUserId: userId, toUserId: loggedInUserId },
        ],
      }).lean();

      connectionStatus = "not_connected";

      if (connectionRequest) {
        if (connectionRequest.status === "accepted") {
          connectionStatus = "connected";
        } else if (
          connectionRequest.status === "interested" &&
          connectionRequest.fromUserId.toString() === loggedInUserId
        ) {
          connectionStatus = "pending_sent";
        } else if (
          connectionRequest.status === "interested" &&
          connectionRequest.fromUserId.toString() === userId
        ) {
          connectionStatus = "pending_received";
        }
      }

      const userProfileWithStatus = {
        ...userProfileWithMutualConnections,
        connectionStatus,
      };

      res.status(200).json({
        message: "User profile details fetched successfully",
        user: userProfileWithStatus,
      });
    } catch (error: any) {
      res.status(500).json({
        message:
          error instanceof Error
            ? "ERROR: " + error.message
            : "ERROR: Something went wrong",
      });
    }
  },
);

// Edit logged in user's profile
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

    res.status(200).json({
      message: `${loggedInUser.firstName}, Your profile has been updated successfully`,
      user: loggedInUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: "ERROR : " + error.message });
    } else {
      res.status(500).json({ message: "ERROR : Something went wrong" });
    }
  }
});

export default profileRouter;
