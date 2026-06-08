import express from "express";
import { loginAdmin, registerAdmin, changeAdminPassword } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.put("/change-password", protectAdmin, changeAdminPassword);

export default router;
