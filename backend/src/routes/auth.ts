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

    console.log("Signup input:", signupInput?.email);

    const { email, password } = signupInput;

    const inValidationMsg = signupDataValidation(signupInput);

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
      // domain: ".devtinder.com",
    });
    // 👉🏻 Domain attribute of the cookie in the browser is used to define that to which backend url's this cookie will be sent. It's a security measure for keeping cookies sperate for diff websites.
    // 👉🏻 A server can only set cookies for its own domain or parent domain.
    // 👉🏻 If we set domain other than our actual backend domain, cookie will not be set in browser and we will get "Set-Cookie header present but no cookie stored" error in browser console.
    // 👉🏻 So, its actual use case is to widen-up the domains where this cookie will be sent by browser after it sets up. Like if we login to api.gmail.google.com then it will set domain: ".google.com" so that it works for even "api.youtube.google.com".

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res
      .status(201)
      .json({ message: "Signup successfull", user: userWithoutPassword });
    return;
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Something went wrong";
    res.status(400).json({ message: "ERROR: " + errorMsg });
    return;
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body.email);

    const inValidationMsg = loginDataValidation({ email, password });

    console.log("Login validation message:", inValidationMsg);

    // 🚨 Do not forget to select password field which is excluded by default 🚨
    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new Error("Invalid credentials");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

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

    const { password: _, ...userWithoutPassword } = user.toObject();

    res
      .status(200)
      .json({ message: "Logged in successfully", user: userWithoutPassword });
    return;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(400).json({ message: "ERROR: " + errorMessage });
    return;
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
    return;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(401).json({ message: "ERROR: " + errorMessage });
    return;
  }
});

export default authRouter;
