import express from "express";
import * as gameController from "../controllers/gameController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.get("/", gameController.getAllGames);
router.get("/:id", gameController.getGameById);
router.post("/", auth, gameController.createGame);
router.post("/:id/play", auth, gameController.updatePlayCount);

export default router;
