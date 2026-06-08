import express from "express";
import { getLeaders, getLeaderById, createLeader, updateLeader, deleteLeader } from "../controllers/leaderController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getLeaders);
router.get("/:id", getLeaderById);
router.post("/", protectAdmin, createLeader);
router.put("/:id", protectAdmin, updateLeader);
router.delete("/:id", protectAdmin, deleteLeader);

export default router;
