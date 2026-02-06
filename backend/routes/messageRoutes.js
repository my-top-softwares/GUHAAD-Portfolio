import express from "express";
import {
    createMessage,
    getMessages,
    deleteMessage,
    updateMessageStatus,
    deleteAllMessages
} from "../controllers/messageController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
    .post(createMessage)
    .get(protect, admin, getMessages)
    .delete(protect, admin, deleteAllMessages);

router.route("/:id")
    .put(protect, admin, updateMessageStatus)
    .delete(protect, admin, deleteMessage);

export default router;
