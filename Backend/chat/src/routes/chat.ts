import express from 'express';
import { createNewChat } from '../controllers/chat';
import { isAuth } from '../middlewares/isAuth';

const router = express.Router();

router.post("/chat/new", isAuth, createNewChat)

export default router;