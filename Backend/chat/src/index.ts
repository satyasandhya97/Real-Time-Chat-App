import express from 'express';
import dotenv from "dotenv";
import connectDb from './config/db';
import chatRoutes from './routes/chat'

dotenv.config();


connectDb();

const app = express();

app.use(express.json());

app.use("/api/v1", chatRoutes);

const port = process.env.PORT;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

