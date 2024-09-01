import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createGame,
  getAllGames,
  getGameById,
  updatePlayCount,
} from "../controllers/gameController";
import { auth } from "../middleware/auth";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", getAllGames);
router.get("/:id", getGameById);
router.post("/", auth, upload.single("image"), createGame);
router.post("/:id/play", updatePlayCount);

export default router;
