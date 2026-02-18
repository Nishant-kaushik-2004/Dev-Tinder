import express, { Request, Response } from "express";
import { ConnectionReqModel } from "../models/connectionReqModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

const requestRouter = express.Router();

// Extend Express Request type to include 'user'.
declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

const ensureNotSelf = (a: string, b: string) => {
  if (a === b) throw new Error("Cannot perform action on yourself");
};

requestRouter.post("/send/:toUserId", async (req: Request, res: Response) => {
  try {
    const fromUserId = req.user;
    const { toUserId } = req.params;
    const { status } = req.body;

    ensureNotSelf(fromUserId!, toUserId);

    const allowedStatus = ["interested", "ignored"];

    if (!allowedStatus.includes(status))
      throw new Error("Invalid connection request status");

    // validates if the userId got is a valid mongoDb objectId.
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      throw new Error(`Invalid user identifier`);
    }

    // Necessary to check if toUserId is present in DB or not as we are creating something in database involving that user.
    const isToUserPresent = await User.findById(toUserId);

    // Check if any user present with the given userId
    if (!isToUserPresent) {
      res.status(404).json({
        message: `No user found with userId: ${toUserId}.`,
      });
      return;
    }

    // if (fromUserId?.equals(toUserId)) //Done in 'pre-save hook' of connReqSchema
    //   throw new Error("Can't connect with yourself");

    const existingReq = await ConnectionReqModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingReq) {
      res.status(409).json({
        message: `Connection already exist with status ${existingReq.status}`,
        connReq: existingReq,
      });
      return;
    }

    const connReq = new ConnectionReqModel({
      fromUserId,
      toUserId,
      status,
    });

    await connReq.save();

    res.status(200).json({
      message: `Match ${
        connReq.status === "interested" ? "request sent" : "profile ignored"
      } successfully`,
      connReq,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: "ERROR : " + error.message });
    } else {
      res.status(500).json({ message: "ERROR : Something went wrong" });
    }
  }
});

// These is used when you already have requestId, e.g.:
// • Match request list page, Matches list Page
// • Admin tools
// • Notifications
requestRouter.patch(
  "/review/:requestId",
  async (req: Request, res: Response) => {
    try {
      const { requestId } = req.params;
      const { status } = req.body;
      console.log(req.body);
      if (!["accepted", "rejected"].includes(status)) {
        res.status(400).json({
          message: "Invalid connection response status",
        });
        return;
      }

      // validates if the requestId got is a valid mongoDb objectId.
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        res.status(400).json({
          message: "Invalid request identifier",
        });
        return;
      }

      // Earlier i am finding just by requestId then one by one checking for the status and toUserId but now i am directly finding by all three, this is more efficient as it will return null if any of the condition is not matched and we are also reducing the number of DB calls.
      // Not required to say eaxactly whats wrong in the response msg.
      const connRequest = await ConnectionReqModel.findOne({
        _id: requestId,
        toUserId: req.user,
        status: "interested",
      });

      if (!connRequest) {
        res.status(404).json({
          message: "Match request not found",
        });
        return;
      }

      connRequest.status = status as "accepted" | "rejected";

      await connRequest.save();

      res.status(200).json({
        message: `Match request ${status}`,
        connRequest,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: "ERROR : " + error.message });
      } else {
        res.status(500).json({ message: "ERROR : Something went wrong" });
      }
    }
  },
);

// Review connection request (accept/reject) for a specific fromUserId
requestRouter.patch(
  "/review/:fromUserId",
  async (req: Request, res: Response) => {
    try {
      const toUserId = req.user;
      const { fromUserId } = req.params;
      const { status } = req.body;

      ensureNotSelf(fromUserId, toUserId!);

      if (!["accepted", "rejected"].includes(status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
      }

      // Returning raw ID in error ❌ Not recommended
      if (!mongoose.Types.ObjectId.isValid(toUserId!)) {
        res.status(400).json({
          message: "Invalid user identifier",
        });
        return;
      }

      const request = await ConnectionReqModel.findOne({
        fromUserId,
        toUserId,
        status: "interested",
      });

      if (!request) {
        res.status(404).json({ message: "Request not found" });
        return;
      }

      request.status = status;
      await request.save();

      res.status(200).json({ message: `Request ${status}`, request });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: "ERROR : " + error.message });
      } else {
        res.status(500).json({ message: "ERROR : Something went wrong" });
      }
    }
  },
);

// Cancel connection request sent to a specific toUserId by loggedIn user
requestRouter.delete(
  "/cancel/:toUserId",
  async (req: Request, res: Response) => {
    try {
      const fromUserId = req.user;
      const { toUserId } = req.params;

      if (!toUserId || !fromUserId) {
        res
          .status(400)
          .json({ message: "Both fromUserId and toUserId are required" });
        return;
      }

      ensureNotSelf(fromUserId, toUserId);

      if (
        !mongoose.Types.ObjectId.isValid(toUserId) ||
        !mongoose.Types.ObjectId.isValid(fromUserId)
      ) {
        res.status(400).json({ message: "Invalid user identifier" });
        return;
      }

      const existingRequest = await ConnectionReqModel.findOneAndDelete({
        fromUserId,
        toUserId,
        status: "interested",
      });

      if (!existingRequest) {
        res.status(404).json({ message: "Request not found" });
        return;
      }

      res.json({ message: "Request cancelled" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: "ERROR : " + error.message });
      } else {
        res.status(500).json({ message: "ERROR : Something went wrong" });
      }
    }
  },
);

export default requestRouter;
