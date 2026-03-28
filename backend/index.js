// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();
// import { connect } from "mongoose";
// import connectDb from "./config/db.js";
// import authRouter from "./routes/auth.routes.js";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import userRouter from "./routes/user.routes.js";

// // It is DNS Issue.
// import dns from "node:dns/promises";
// import geminiResponse from "./gemini.js";
// dns.setServers(["1.1.1.1", "8.8.8.8"]);

// const app = express();
// app.use(cors({
//     origin: "https://virtualassistant-fronend-v50y.onrender.com",
//     credentials: true,
//   }),
// );
// const port = process.env.PORT || 5000;
// app.use(express.json());
// app.use(cookieParser());
// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);

//   //For Testing  Gemini API
// app.get("/", async (req, res) => {
//    let prompt=req.query.prompt
//    let data= await geminiResponse(prompt)
//    res.json(data)
//   });

// app.get("/", (req, res) => {
//   res.send("Radha");
// });

// app.listen(port, () => {
//   connectDb();
//   console.log("Server Started!");
// });
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

// DNS Fix
import dns from "node:dns/promises";
import geminiResponse from "./gemini.js";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS
app.use(cors({
  origin: "https://virtualassistant-fronend-v50y.onrender.com",
  credentials: true,
}));

// ✅ FIXED (important)
app.options("/*", cors());

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Gemini route
app.get("/gemini", async (req, res) => {
  try {
    let prompt = req.query.prompt;
    let data = await geminiResponse(prompt);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// Start server
app.listen(port, () => {
  connectDb();
  console.log("Server Started!");
});