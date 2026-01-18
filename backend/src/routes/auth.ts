import { Request, Response, Router } from "express";
import { User } from "../models/userModel.js";
import {
  signupDataValidation,
  loginDataValidation,
} from "../utils/validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const signupInput = req.body;

    console.log("Signup input:", signupInput);

    const { email, password } = signupInput;

    const inValidationMsg = signupDataValidation(signupInput);

    console.log("Signup validation message:", inValidationMsg);

    if (inValidationMsg) throw new Error(inValidationMsg);

    const user = await User.findOne({ email });

    if (user) {
      res
        .status(409)
        .json({ message: "A user already registered with this email address" });
      return;
    }

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
      },
    );

    // ✅ Set cookie in response
    res.cookie("token", token, {
      httpOnly: true, // Prevent JS access
      secure: true, // MUST be true (we had made ec2 backend HTTPS now using nginx)
      path: "/", // VERY IMPORTANT as Cookie may only apply to /login
      sameSite: "none", // REQUIRED for cross-site (Vercel → EC2)
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
      // secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ message: "Signup successfull", user: newUser });
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Something went wrong";
    res.status(400).json({ message: "ERROR: " + errorMsg });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const inValidationMsg = loginDataValidation({ email, password });

    console.log("Login validation message:", inValidationMsg);

    if (inValidationMsg) throw new Error(inValidationMsg);

    // 🚨 Do not forget to select password field which is excluded by default 🚨
    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new Error("Invalid credentials");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log(isPasswordCorrect);

    if (!isPasswordCorrect) throw new Error("Invalid credentials");

    // ✅ Generate JWT token
    const token = jwt.sign(
      { loggedInUserId: user._id },
      process.env.SECRETKEY!,
      {
        expiresIn: "30d",
      },
    );

    // ✅ Set cookie in response
    res.cookie("token", token, {
      httpOnly: true, // Prevent JS access
      secure: true, // MUST be true (we had made ec2 backend HTTPS now using nginx)
      path: "/", // VERY IMPORTANT as Cookie may only apply to /login
      sameSite: "none", // REQUIRED for cross-site (Vercel → EC2)
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
      // secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Logged in successfully", user });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(400).json({ message: "ERROR: " + errorMessage });
  }
});

authRouter.post("/logout", (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none", // REQUIRED for cross-site (Vercel → EC2)
      secure: true, // MUST be true (we had made ec2 backend HTTPS now using nginx)
      path: "/", // VERY IMPORTANT as Cookie may only apply to /login so gone on refresh
      // domain: "localhost", // 👈 add this if you’re on localhost
    });
    console.log("Logged out successfully");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(401).json({ message: "ERROR: " + errorMessage });
  }
});

export default authRouter;
