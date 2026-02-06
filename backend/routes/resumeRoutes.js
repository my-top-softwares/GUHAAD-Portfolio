import express from "express";
import {
    getResumeItems,
    createResumeItem,
    updateResumeItem,
    deleteResumeItem
} from "../controllers/resumeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
    .get(getResumeItems)
    .post(protect, admin, createResumeItem);

router.route("/:id")
    .put(protect, admin, updateResumeItem)
    .delete(protect, admin, deleteResumeItem);

export default router;
