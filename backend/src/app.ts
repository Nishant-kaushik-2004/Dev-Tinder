// app.ts or server.ts
import dotenv from "dotenv";
dotenv.config(); // MUST be first
import express from "express";
import { User } from "./models/userModel.js";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/requests.js";
import userRouter from "./routes/user.js";
import userAuth from "./middleware/auth.js";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json()); // works as middleware for every route as it parses the payload data to json format.
app.use(cookieParser()); // works as middleware for every route as it parses the cookies present in the request.

// Send the request from wherever it got the first
app.use(authRouter, userAuth, profileRouter, requestRouter, userRouter);// this is app level Middleware, Here userAuth is applied to all routes declared after it in the middleware chain.
// 🔄 Option 1: App-Level Middleware in app.use -> Used when most routes require auth.
// 🎯 Option 2: Router-Level Middleware ->  Use when only specific route groups need protection.

connectDb()
  .then(() => {
    console.log("db connected successfully");
    app.listen(3333, () => {
      console.log("Server successfully started listening");
    });
  })
  .catch((err) => {
    console.log(
      "An unexpected error occured while connecting database : ",
      err
    );
  });
app.use("/", (req, res, next) => {
  // res.json("laila mai laila");
  next();
});

app.post("/insertuser", async (req, res, next) => {
  console.log(req.body);
  const newUser = new User(req.body);
  await newUser.save();
  console.log("user saved successfully in the database");
  res.status(201).json(req.body);
});
