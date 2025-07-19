import express from 'express';
import { createNewChat, getAllChats } from '../controllers/chat';
import { isAuth } from '../middlewares/isAuth';

const router = express.Router();

router.post("/chat/new", isAuth, createNewChat)
router.get("/chat/all", isAuth, getAllChats);

export default router;