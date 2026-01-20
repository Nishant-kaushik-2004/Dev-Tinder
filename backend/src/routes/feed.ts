import express, { Request, Response } from "express";
import { User } from "../models/userModel.js";
import { ConnectionReqModel } from "../models/connectionReqModel.js";
import { Message } from "../models/chatModel.js";
import { mongo } from "mongoose";

const feedRouter = express.Router();

export const USER_SAFE_DATA =
  "firstName lastName photoUrl age gender about skills location isFresher experience company jobTitle";

// Get feed for logged in user. (All users except already interacted ones)
feedRouter.get("/", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user;

    if (
      typeof loggedInUserId !== "string" ||
      !mongo.ObjectId.isValid(loggedInUserId)
    ) {
      res
        .status(400)
        .json({ message: "Invalid logged in user id, Please login again" });
      return;
    }

    // Pagination
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    let limit = parseInt(req.query.limit as string) || 10;
    limit = Math.min(limit, 30);

    const skip = (page - 1) * limit;

    // Filters
    const { technologies, location, experienceLevel } = req.query;

    const filterQuery: any = {};

    // Normalize technologies (string | string[])
    const techArray =
      typeof technologies === "string"
        ? [technologies]
        : Array.isArray(technologies)
          ? technologies
          : [];

    if (techArray.length) {
      filterQuery.skills = { $in: techArray };
    }

    if (location) {
      filterQuery.location = { $regex: location, $options: "i" };
    }

    if (experienceLevel) {
      filterQuery.experience = experienceLevel;
    }

    // Hidden users logic
    const connRequests = await ConnectionReqModel.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    })
      .select("fromUserId toUserId")
      .lean();

    const hiddenUsers = new Set<string>();

    connRequests.forEach((req) => {
      hiddenUsers.add(req.fromUserId.toString());
      hiddenUsers.add(req.toUserId.toString());
    });

    // Final Query
    const usersShownInFeed = await User.find({
      _id: {
        $nin: [...hiddenUsers, loggedInUserId],
      },
      ...filterQuery,
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      message: "Feed fetched successfully",
      developers: usersShownInFeed,
      pagination: {
        page,
        limit,
        hasMore: usersShownInFeed.length === limit,
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(400).json({ message: "ERROR: " + error.message });
    } else {
      res.status(500).json({ message: "ERROR: Something went wrong" });
    }
  }
});

// Get feed stats for logged in user.
feedRouter.get("/stats", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user;

    if (
      typeof loggedInUserId !== "string" ||
      !mongo.ObjectId.isValid(loggedInUserId)
    ) {
      res
        .status(400)
        .json({ message: "Invalid logged in user id, Please login again" });
      return;
    }

    const today = new Date().toDateString();

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const loggedInUser = await User.findById(loggedInUserId).select(
      "profileViews lastViewedBy",
    );

    const totalViews = loggedInUser?.profileViews || 0;

    const newViewsToday = Object.values(
      loggedInUser?.lastViewedBy || {},
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

    res.status(200).json({
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
      res.status(400).json({ message: "ERROR : " + error.message });
    } else {
      res.status(500).json({ message: "ERROR : Something went wrong" });
    }
  }
});

export default feedRouter;
