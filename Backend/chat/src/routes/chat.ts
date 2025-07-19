import express from 'express';
import { createNewChat, getAllChats, sendMessage } from '../controllers/chat';
import { isAuth } from '../middlewares/isAuth';
import { upload } from '../middlewares/multer';

const router = express.Router();

router.post("/chat/new", isAuth, createNewChat)
router.get("/chat/all", isAuth, getAllChats);
router.post("/message", isAuth, upload.single('image'), sendMessage);

export default router;