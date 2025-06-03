console.log("🚀 Starting app...");

const express = require("express");
const app = express();

require("dotenv").config();

const authRouter = require("./src/routes/authRouter");
const ListsRouter = require("./src/routes/listsRouter");

const authMiddleware = require("./src/middleware/authMiddleware");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/lists", authMiddleware, ListsRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
