import { redisClient } from "..";
import { publishToQueue } from "../config/rabbitmq";
import TryCatch from "../config/TryCatch";

export const loginUser = TryCatch(async(req, res)=>{
    const {email} = req.body;

    const rateLimitKey = `otp:rateLimit:${email}`

    const rateLimit = await redisClient.get(rateLimitKey)

    if(rateLimit){
        res.status(429).json({
            message:"Too many requests. Please wait before requesting new otp",
        });
        return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, otp, {
        EX: 300,
    });
    await redisClient.set(rateLimitKey, "true",{
        EX:60,
    })

    const message = {
        to:email,
        subject: "Your otp code",
        body: `Your OTP is ${otp}. It is valid for 5 minutes`,
    };

    await publishToQueue("send-otp", message)

    res.status(200).json({
        message:"OTP send your mail"
    })
})