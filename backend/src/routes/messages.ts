import express, { Request, Response } from "express";
import { Chat, Message } from "../models/chatModel.js";
import mongoose from "mongoose";

const messageRouter = express.Router();

messageRouter.get("/:chatId", async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user as string;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      res.status(400).json({
        message:
          "Invalid chatId, The chat you are looking for does not exist!!",
        error: "ERROR: Invalid chatId",
      });
      return;
    }

    const chat = await Chat.findById(chatId).select("_id participants");
    if (!chat) {
      res.status(404).json({
        message:
          "Chat not found, The chat you are looking for does not exist!!",
        error: "ERROR: Chat not found",
      });
      return;
    }

    // comparing as strings because participants are stored as ObjectId
    if (!chat?.participants.map((p: any) => p.toString()).includes(userId)) {
      res.status(403).json({
        message: "Access denied, You are not a participant of this chat!!",
        error: "ERROR: Access denied",
      });
      return;
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

    res
      .status(200)
      .json({ message: "Messages fetched successfully", messages: formatted });
  } catch (error) {
    console.error("Error fetching messages:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({
      message: "Internal server error",
      error: "ERROR: " + errorMessage,
    });
  }
});

export default messageRouter;
