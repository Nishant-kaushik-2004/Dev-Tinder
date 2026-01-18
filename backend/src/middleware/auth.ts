import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const userAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies["token"]; //const token = req.cookies.token;
    // Both are valid syntax.

    if (!token) {
      res.status(401).json({
        message: "You are Unauthorised, Please login first!",
      });
      return;
    }

    const decodedObject = jwt.verify(token, process.env.SECRETKEY!);

    if (!decodedObject || typeof decodedObject !== "object") {
      throw new Error("Invalid token payload");
    }

    if (!decodedObject.loggedInUserId) {
      res.status(401).json({
        message: "You are Unauthorised, Please login first!",
      });
      return;
    }

    req.user = decodedObject.loggedInUserId;

    next();
  } catch (error) {
    console.error("Invalid JSON string:", error);
    res
      .status(400)
      .json({ message: "ERROR: " + "Invalid Token! Please login again." });
  }
};

export default userAuth;
