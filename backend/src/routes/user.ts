import express from "express";
import { ConnectionReqModel } from "../models/connectionReqModel.js";
import { User } from "../models/userModel.js";

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills location isFresher experience company jobTitle profileViews";

// Get all the pending connections of the loggedIn user.
userRouter.get("/user/requests/received", async (req, res) => {
  try {
    const loggedInUserId = req.user;

    if (!loggedInUserId)
      return res.status(401).json({
        message:
          "You are Unauthorised, Please login first to see received requests!",
      });

    const requests = await ConnectionReqModel.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA); // Specifying what fields the populated document should have. if not specified then it would have all fields present.
    // }).populate("fromUserId", ["firstName", "lastName"]);  // Both are correct ways.

    return res.status(200).json({
      message: "Fecthed all pending connection requests successfully",
      requests,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: "ERROR : " + error.message });
    } else {
      return res.status(500).json({ message: "ERROR : Something went wrong" });
    }
  }
});

userRouter.get("/user/connections", async (req, res) => {
  try {
    const loggedInUserId = req.user;

    if (!loggedInUserId)
      return res.status(401).json({
        message:
          "You are Unauthorised, Please login first to see all connections!",
      });

    const connectionsData = await ConnectionReqModel.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).populate(["fromUserId", "toUserId"], USER_SAFE_DATA); // Specifying what fields the populated document should have. if not specified then it would have all fields present.
    // }).populate("fromUserId", ["firstName", "lastName"]);  // Both are correct ways.

    const connections = connectionsData.map((row) =>
      row.fromUserId._id.toString() === loggedInUserId // Will not give "property _id not exist on objectId" because i had already provided in the connectionReqSchema's type(IConnectionReq) as fromUserId and toUserId can be of IUserSafe type object also.
        ? row.toUserId
        : row.fromUserId
    );

    return res.status(200).json({
      message: "Fecthed all connections successfully",
      connections,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: "ERROR : " + error.message });
    } else {
      return res.status(500).json({ message: "ERROR : Something went wrong" });
    }
  }
});

userRouter.get("/user/feed", async (req, res) => {
  try {
    const loggedInUserId = req.user;

    console.log(loggedInUserId);
    // Pagination through backend
    const page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 10;

    limit = limit > 30 ? 30 : limit;

    const skip = (page - 1) * limit;

    // All connections where loggedIn user is involved(either send or received).
    const connRequests = await ConnectionReqModel.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select("fromUserId toUserId");

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
      .limit(limit); // if we pass 0 in skip or limit then it will ignore skip or limit  and do not do any filtering or limiting respectively.

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

export default userRouter;
