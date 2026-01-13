import express from "express";
import { User } from "../models/userModel.js";
import { ConnectionReqModel } from "../models/connectionReqModel.js";
import { Message } from "../models/chatModel.js";
import { mongo } from "mongoose";

const feedRouter = express.Router();

export const USER_SAFE_DATA =
  "firstName lastName photoUrl age gender about skills location isFresher experience company jobTitle";

// Get feed for logged in user. (All users except already interacted ones)
feedRouter.get("/feed", async (req, res) => {
  try {
    const loggedInUserId = req.user;

    if (
      typeof loggedInUserId !== "string" ||
      !mongo.ObjectId.isValid(loggedInUserId)
    ) {
      return res
        .status(400)
        .json({ message: "ERROR : Invalid logged in user id" });
    }

    // Pagination through backend
    const page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 10;

    limit = Math.min(limit, 30); // Max limit is 30

    const skip = (page - 1) * limit;

    // All connections where loggedIn user is involved(either send or received).
    const connRequests = await ConnectionReqModel.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    })
      .select("fromUserId toUserId")
      .lean();

    // User's with whom loggedInUser is already interacted.
    const hiddenUsers = new Set();

    connRequests.forEach((req) => {
      hiddenUsers.add(req.fromUserId.toString());
      hiddenUsers.add(req.toUserId.toString());
    }); // This Set will includes loggedInUserId also.

    const usersShownInFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsers) } },
        { _id: { $ne: loggedInUserId } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit) // if we pass 0 in skip or limit then it will ignore skip or limit and do not do any filtering or limiting respectively.
      .lean();

    return res.status(200).json({
      message: "Feed fecthed successfully",
      users: usersShownInFeed,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: "ERROR : " + error.message });
    } else {
      return res.status(500).json({ message: "ERROR : Something went wrong" });
    }
  }
});

// Get feed stats for logged in user.
feedRouter.get("/feed/stats", async (req, res) => {
  try {
    const loggedInUserId = req.user;

    if (
      typeof loggedInUserId !== "string" ||
      !mongo.ObjectId.isValid(loggedInUserId)
    ) {
      return res
        .status(400)
        .json({ message: "ERROR : Invalid logged in user id" });
    }

    const today = new Date().toDateString();

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const loggedInUser = await User.findById(loggedInUserId).select(
      "profileViews lastViewedBy"
    );

    const totalViews = loggedInUser?.profileViews || 0;

    const newViewsToday = Object.values(
      loggedInUser?.lastViewedBy || {}
    ).filter((date) => date === today).length;

    const totalMatches = await ConnectionReqModel.countDocuments({
      status: "accepted",
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    });

    const newMatchesThisWeek = await ConnectionReqModel.countDocuments({
      status: "accepted",
      updatedAt: { $gte: startOfWeek },
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    });

    const userObjectId = new mongo.ObjectId(loggedInUserId);

    const messageStats = await Message.aggregate([
      // Join chat data
      {
        $lookup: {
          from: "chats",
          localField: "chatId",
          foreignField: "_id",
          as: "chat",
        },
      },
      { $unwind: "$chat" },

      // Only messages:
      // - user is participant
      // - message is NOT sent by logged-in user (received messages)
      {
        $match: {
          "chat.participants": userObjectId, // ❌ Never compare ObjectId fields with strings in aggregation, as it won't automatically cast unlike in normal mongoose queries.
          sender: { $ne: userObjectId },
        },
      },

      // Compute totals
      {
        $facet: {
          total: [{ $count: "count" }],
          newThisWeek: [
            { $match: { createdAt: { $gte: startOfWeek } } },
            { $count: "count" },
          ],
        },
      },
    ]);
    // Good Alternative approach without aggregation: as for this simple counts, aggregation might be overkill.
    // const userChats = await Chat.find(
    //   { participants: loggedInUserId },
    //   { _id: 1 }
    // ).lean();

    // const chatIds = userChats.map((c) => c._id);

    // const totalMessagesReceived = await Message.countDocuments({
    //   chatId: { $in: chatIds },
    //   sender: { $ne: loggedInUserId },
    // });

    // const newMessagesThisWeek = await Message.countDocuments({
    //   chatId: { $in: chatIds },
    //   sender: { $ne: loggedInUserId },
    //   createdAt: { $gte: startOfWeek },
    // });

    return res.status(200).json({
      message: "Feed stats fetched successfully",
      stats: {
        views: {
          totalViews,
          newViewsToday,
        },
        matches: {
          totalMatches,
          newMatchesThisWeek,
        },
        messages: {
          totalMessages: messageStats[0]?.total[0]?.count ?? 0,
          newMessagesThisWeek: messageStats[0]?.newThisWeek[0]?.count ?? 0,
        },
        // messages: {
        //   totalMessages: totalMessagesReceived,
        //   newMessagesThisWeek: newMessagesThisWeek,
        // },
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: "ERROR : " + error.message });
    } else {
      return res.status(500).json({ message: "ERROR : Something went wrong" });
    }
  }
});

export default feedRouter;
