import TryCatch from "../config/TryCatch";
import { AuthenticatedRequest } from "../middlewares/isAuth";
import { Chat } from "../models/chats";

export const createNewChat = TryCatch(async(req: AuthenticatedRequest, res)=>{
    const userId = req.user?._id;
    const { otherUserId } = req.body;

    if(!otherUserId){
        res.status(400).json({
            message: "Other userId is required",
        });
        return;
    }
    
    const existingChat = await Chat.findOne({
        users: {$all:[userId, otherUserId], $size: 2}
    })
    
    if(existingChat){
        res.json({
            message : "Chat already exist",
            chatId: existingChat._id,
        });
        return;
    }

    const newChat = await Chat.create({
        users:[userId, otherUserId],
    })

    res.status(201).json({
        message: "New Chat created",
        chatId: newChat._id,
    });

    


})