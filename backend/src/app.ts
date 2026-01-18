// app.ts or server.ts
import dotenv from "dotenv";
dotenv.config(); // MUST be first
import express from "express";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/requests.js";
import userRouter from "./routes/user.js";
import userAuth from "./middleware/auth.js";
import cors from "cors";
import { createServer } from "node:http";
import InitializeSocket from "./utils/socket.js";
import chatRouter from "./routes/chats.js";
import feedRouter from "./routes/feed.js";

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3333;

// var corsOptions = {
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// This tells Express: “The original request was HTTPS, even if I see HTTP internally.”
app.set("trust proxy", true);
// Without this:
// 	•	secure: true cookies ❌
// 	•	Sessions break ❌
// 	•	Auth breaks on refresh ❌

const allowedOrigins = [
  process.env.FRONTEND_URL, // production (Vercel)
  "http://localhost:5173", // local dev
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, curl, etc.
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

InitializeSocket(server);

// Middleware to parse JSON bodies
app.use(express.json()); // works as middleware for every route as it parses the payload data to json format.
app.use(cookieParser()); // works as middleware for every route as it parses the cookies present in the request.

// Send the request from wherever it got the first
app.use(
  authRouter,
  userAuth,
  feedRouter,
  profileRouter,
  requestRouter,
  userRouter,
  chatRouter,
); // this is app level Middleware, Here userAuth is applied to all routes declared after it in the middleware chain.
// 🔄 Option 1: App-Level Middleware in app.use -> Used when most routes require auth.
// 🎯 Option 2: Router-Level Middleware ->  Use when only specific route groups need protection.

connectDb()
  .then(() => {
    console.log("db connected successfully");
    server.listen(PORT, () => {
      console.log(`server running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(
      "An unexpected error occured while connecting database : ",
      err,
    );
    process.exit(1);
  });
