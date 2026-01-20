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

requestRouter.post("/send/:toUserId",
  async (req: Request, res: Response) => {
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
  },
);

// These is used when you already have requestId, e.g.:
// • Match request list page, Matches list Page
// • Admin tools
// • Notifications
requestRouter.patch("/review/:requestId",
  async (req: Request, res: Response) => {
    try {
      const toUserId = req.user;
      const { requestId } = req.params;
      const { status } = req.body;

      const toUser = await User.findById(toUserId); // When i will write middleware then i had to check the loggedInUser(user coming from req.user, injected by middleware) has the same toUserId as this request or not.
      // because request to someone else can't be accepted by the loggedIn user if he is not the toUserId(reciever) of it.

      if (!toUser) {
        res.status(401).json({
          message: `Unauthorised user!! please login first to review requests.`,
        });
        return;
      }

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status))
        throw new Error("Invalid connection response status!");

      // validates if the requestId got is a valid mongoDb objectId.
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new Error("Invalid request identifier");
      }

      const connRequest = await ConnectionReqModel.findById(requestId);
      // can be removed from here and checked afterwards about that it is ignored or interested, but sending the msg that status is rejected(if so) is not usefull here.

      if (!connRequest || connRequest.status !== "interested") {
        res
          .status(404)
          .json({ message: `No pending match request has been sent` });
        return;
      }

      // loggedIn user should be toUserId
      if (connRequest.toUserId.toString() !== toUserId) {
        throw new Error(`This match request is not sent to you`);
      }

      connRequest.status = status as "interested" | "ignored";

      // const fromUserId = connRequest.fromUserId;

      // const alreadyReviewdReq = await ConnectionReqModel.findOne({
      //   fromUserId: toUserId, // reciever will become the fromUserId as he/she will accept or reject the request not the sender.
      //   toUserId: fromUserId,
      // });

      // if (alreadyReviewdReq) {
      //   return res.status(400).json({
      //     message: `Connection request already ${alreadyReviewdReq.status} by you`,
      //     connResponse: alreadyReviewdReq,
      //   });
      // }

      // No need to create new connections request document, just change the status from interested to accepted or rejected.
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
requestRouter.patch("/review/:fromUserId",
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
requestRouter.delete( "/cancel/:toUserId",
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
