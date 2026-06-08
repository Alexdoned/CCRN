import express from "express";
import { getRegistrations, createRegistration, updateRegistration, deleteRegistration } from "../controllers/registrationController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protectAdmin, getRegistrations);
router.post("/", createRegistration);
router.put("/:id", protectAdmin, updateRegistration);
router.delete("/:id", protectAdmin, deleteRegistration);

export default router;
