import express, { Request, Response } from "express";
import { Chat, Message } from "../models/chatModel.js";
import mongoose from "mongoose";

const chatRouter = express.Router();

chatRouter.get("/chats", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user;

    // ensure it's an ObjectId
    const userObjectId = new mongoose.Types.ObjectId(loggedInUserId);

    const pipeline = [
      // 1) Only chats where logged-in user is a participant
      { $match: { participants: userObjectId } },

      // 2) Lookup last message
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$chatId", "$$chatId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            {
              $project: {
                _id: 0,
                text: 1,
                createdAt: 1,
                sender: 1,
              },
            },
          ],
          as: "lastMessageArr",
        },
      },

      // 3) Count unread messages for this user
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$chatId", "$$chatId"] },
                seenBy: { $ne: userObjectId },
              },
            },
            { $count: "unreadCount" },
          ],
          as: "unreadArr",
        },
      },

      // 4) Determine the *other* participant
      {
        $addFields: {
          otherUserId: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$participants",
                  as: "p",
                  cond: { $ne: ["$$p", userObjectId] },
                },
              },
              0,
            ],
          },
        },
      },

      // 5) Lookup user details for other participant
      {
        $lookup: {
          from: "users",
          localField: "otherUserId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                photoUrl: 1,
                about: 1,
              },
            },
          ],
          as: "participantInfo",
        },
      },

      // Convert array → single object
      {
        $addFields: {
          participantInfo: { $arrayElemAt: ["$participantInfo", 0] },
        },
      },

      // 6) Final projection
      {
        $project: {
          _id: 0,
          chatId: "$_id",
          participantInfo: 1,
          lastMessage: { $arrayElemAt: ["$lastMessageArr.text", 0] },
          timestamp: { $arrayElemAt: ["$lastMessageArr.createdAt", 0] },
          unreadCount: {
            $ifNull: [{ $arrayElemAt: ["$unreadArr.unreadCount", 0] }, 0],
          },
        },
      },

      // 7) Sort by last message timestamp
      {
        $sort: { timestamp: -1 },
      },
    ];

    // Run pipeline on Chat collection
    const rawResults = await Chat.aggregate(pipeline as any).allowDiskUse(true);

    // // Map output to exactly desired client schema (string ids and ISO timestamps)
    // const results = rawResults.map((c) => ({
    //   userId: c.otherUserId ? String(c.otherUserId) : null,
    //   lastMessage: c.lastMessage || "",
    //   timestamp: c.timestamp ? new Date(c.timestamp).toISOString() : null,
    //   unreadCount: c.unreadCount || 0,
    //   chatId: c.chatId ? String(c.chatId) : null,
    // }));

    res
      .status(200)
      .json({ message: "Chats fetched successfully", chats: rawResults });
    return;
  } catch (err: unknown) {
    console.error("GET /api/chats error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: message });
    return;
  }
});

chatRouter.get("/messages/:chatId", async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user as string;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({
        message:
          "Invalid chatId, The chat you are looking for does not exist!!",
        error: "ERROR: Invalid chatId",
      });
    }

    const chat = await Chat.findById(chatId).select("_id participants");
    if (!chat) {
      return res.status(404).json({
        message:
          "Chat not found, The chat you are looking for does not exist!!",
        error: "ERROR: Chat not found",
      });
    }

    // comparing as strings because participants are stored as ObjectId
    if (!chat.participants.map((p: any) => p.toString()).includes(userId)) {
      return res.status(403).json({
        message: "Access denied, You are not a participant of this chat!!",
        error: "ERROR: Access denied",
      });
    }

    // Fetch messages
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 }) // oldest → newest
      .select("_id text sender seenBy createdAt");

    // Format response
    const formatted = messages.map((msg) => ({
      id: msg._id.toString(),
      text: msg.text,
      sender: msg.sender.toString(),
      timestamp: msg.createdAt,
      seenBy: msg.seenBy.map((id) => id.toString()),
    }));

    return res
      .status(200)
      .json({ message: "Messages fetched successfully", messages: formatted });
  } catch (error) {
    console.error("Error fetching messages:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({
      message: "Internal server error",
      error: "ERROR: " + errorMessage,
    });
  }
});

export default chatRouter;
