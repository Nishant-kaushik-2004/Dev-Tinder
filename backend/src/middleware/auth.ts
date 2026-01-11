import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  try {
    const token = req.cookies["token"]; //const token = req.cookies.token;
    // Both are valid syntax.

    if (!token)
      return res.status(401).json({
        message: "You are Unauthorised, Please login first!",
      });

    const decodedObject = jwt.verify(token, process.env.SECRETKEY!);

    if (!decodedObject || typeof decodedObject !== "object") {
      throw new Error("Invalid token payload");
    }

    if (!decodedObject.loggedInUserId)
      return res.status(401).json({
        message: "You are Unauthorised, Please login first!",
      });

    req.user = decodedObject.loggedInUserId;

    next();
  } catch (error) {
    console.error("Invalid JSON string:", error);
    return res
      .status(400)
      .json({ message: "ERROR: " + "Invalid Token! Please login again." });
  }
};

export default userAuth;
