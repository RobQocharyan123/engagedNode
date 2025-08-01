import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/votingRoute.js";
dotenv.config();
connectDB();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
