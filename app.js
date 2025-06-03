const express = require("express");
const app = express();

require("dotenv").config();

const authRouter = require("./src/routes/authRouter");
const ListsRouter = require("./src/routes/listsRouter");

const authMiddleware = require("./src/middleware/authMiddleware");

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/lists", authMiddleware, ListsRouter);

module.exports = app;
