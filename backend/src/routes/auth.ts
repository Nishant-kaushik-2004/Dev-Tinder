import express, { Request, Response } from "express";
import { User } from "../models/userModel.js";
import {
  signupDataValidation,
  loginDataValidation,
} from "../utils/validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const signupInput = req.body;

    console.log(signupInput);

    const { email, password } = signupInput;

    const inValidationMsg = signupDataValidation(signupInput);

    console.log(inValidationMsg);

    if (inValidationMsg) throw new Error(inValidationMsg);

    const user = await User.findOne({ email });

    if (user)
      return res
        .status(409)
        .json({ message: "A user already exist with this email adress" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    signupInput.password = hashedPassword;

    const newUser = new User(signupInput);

    await newUser.save();

    // ✅ Generate JWT token
    const token = jwt.sign(
      { loggedInUserId: newUser._id },
      process.env.SECRETKEY!,
      {
        expiresIn: "30d",
      }
    );

    // ✅ Set cookie in response
    res.cookie("token", token, {
      httpOnly: true, // Prevent JS access
      // secure: true, // Use only over HTTPS (true only for production)
      sameSite: "strict", // Prevent CSRF
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
      secure: process.env.NODE_ENV === "production",
    });

    return res
      .status(200)
      .json({ msg: "User Signed up successfully", user: newUser });
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Something went wrong";
    return res.status(400).json({ message: "ERROR: " + errorMsg });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const inValidationMsg = loginDataValidation({ email, password });

    console.log(inValidationMsg);

    if (inValidationMsg) throw new Error(inValidationMsg);

    const user = await User.findOne({ email });

    if (!user) throw new Error("Invalid credentials");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) throw new Error("Invalid credentials");

    // ✅ Generate JWT token
    const token = jwt.sign(
      { loggedInUserId: user._id },
      process.env.SECRETKEY!,
      {
        expiresIn: "30d",
      }
    );

    // ✅ Set cookie in response
    res.cookie("token", token, {
      httpOnly: true, // Prevent JS access
      // secure: true, // Use only over HTTPS (true only for production)
      sameSite: "strict", // Prevent CSRF
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Logged in successfully", user });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(400).json({ message: "ERROR: " + errorMessage });
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/", // 👈 must match login
      // domain: "localhost", // 👈 add this if you’re on localhost
    });
    console.log("Logged out successfully");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(401).json({ message: "ERROR: " + errorMessage });
  }
});

export default authRouter;
