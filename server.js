
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import historyRoutes from "./routes/history.js";
import chatRoutes from "./routes/chat.js";
import notesRoutes from "./routes/notes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notes", notesRoutes);

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(process.cwd() + "/public/login.html");
});

app.get("/register", (req, res) => {
  res.sendFile(process.cwd() + "/public/register.html");
});

app.get("/login.html", (req, res) => {
  res.sendFile(process.cwd() + "/public/login.html");
});

// Home Route
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

// Server Start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running On ${PORT}`);
});

