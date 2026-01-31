import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const userAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token; //const token = req.cookies["token"];
    // Both are valid syntax.

    if (!token) {
      res.status(401).json({
        message: "Unauthorized: token missing",
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.SECRETKEY!);

    if (typeof decoded !== "object" || !("loggedInUserId" in decoded)) {
      res.status(401).json({
        message: "Unauthorized: invalid token payload",
      });
      return;
    }

    req.user = decoded.loggedInUserId as string;

    next();
  } catch (error) {
    // console.error("Invalid JSON string:", error);
    res
      .status(401)
      .json({ message: "ERROR: " + "Invalid Token! Please login again." });
    return;
  }
};

export default userAuth;
