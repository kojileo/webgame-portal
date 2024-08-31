import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./routes/auth";
import gameRoutes from "./routes/games";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
