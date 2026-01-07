import express from "express";
import { ConnectionReqModel } from "../models/connectionReqModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

const requestRouter = express.Router();

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

requestRouter.post("/request/send/:status/:toUserId", async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const loggedInUser = await User.findById(loggedInUserId);

    const fromUserId = loggedInUser?._id;

    const allowedStatus = ["interested", "ignored"];

    if (!allowedStatus.includes(status))
      throw new Error("Invalid connection request status");

    // validates if the userId got is a valid mongoDb objectId.
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      throw new Error(`Invalid userId: ${toUserId}`);
    }

    if (!fromUserId)
      return res.status(401).json({
        message: `Unauthorised user!! please login first to send requests.`,
      });

    const isToUserIdPresent = await User.findById(toUserId);

    // Check if any user present with the given userId
    if (!isToUserIdPresent)
      return res.status(404).json({
        message: `No user found with userId: ${toUserId}.`,
      });

    // if (fromUserId?.equals(toUserId)) //Done in 'pre-save hook' of connReqSchema
    //   throw new Error("Can't connect with yourself");

    const alreadySentReq = await ConnectionReqModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (alreadySentReq) {
      return res.status(400).json({
        message: `Connection already exist with status ${alreadySentReq.status}`,
        connReq: alreadySentReq,
      });
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
      return res.status(400).json({ message: "ERROR : " + error.message });
    } else {
      return res.status(500).json({ message: "ERROR : Something went wrong" });
    }
  }
});

requestRouter.post("/request/review/:status/:requestId", async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const { status, requestId } = req.params;

    const loggedInUser = await User.findById(loggedInUserId);

    const toUserId = loggedInUser?._id; // When i will write middleware then i had to check the loggedInUser(user coming from req.user, injected by middleware) has the same toUserId as this request or not.
    // because request to someone else can't be accepted by the loggedIn user if he is not the toUserId(reciever) of it.

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status))
      throw new Error("Invalid connection response status!");

    // validates if the requestId got is a valid mongoDb objectId.
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      throw new Error(`Invalid connection requestId: ${requestId}`);
    }

    const connRequest = await ConnectionReqModel.findById(requestId);
    // can be removed from here and checked afterwards about that it is ignored or interested, but sending the msg that status is rejected(if so) is not usefull here.

    if (!toUserId)
      return res.status(401).json({
        message: `Unauthorised user!! please login first to review requests.`,
      });

    if (!connRequest || connRequest.status !== "interested")
      return res
        .status(404)
        .json({ message: `No match request has been sent` });

    // loggedIn user should be toUserId
    if (connRequest.toUserId.toString() !== toUserId.toString()) {
      throw new Error(
        `This match request is not sent to you`
      );
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
      return res.status(400).json({ message: "ERROR : " + error.message });
    } else {
      return res.status(500).json({ message: "ERROR : Something went wrong" });
    }
  }
});

export default requestRouter;
