import express from "express";
import { authUser, registerUser } from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", authUser);
router.post("/register", protect, admin, registerUser); // Only admin can create admin

export default router;
