import express from 'express';
import dotenv from "dotenv";
import connectDb from './config/db';
import { createClient } from 'redis';
import userRoutes from './routes/user';
import { connnectRabbitMQ } from './config/rabbitmq';
import cors from 'cors';

dotenv.config();

connectDb();


connnectRabbitMQ();

export const redisClient = createClient({
  url: process.env.REDIS_URL
})

redisClient
  .connect()
  .then(() => console.log("connented to redis"))
  .catch(console.error)

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/v1", userRoutes);

const port = process.env.PORT;

app.listen(port, ()=> {
    console.log(`server is running on port ${port}`);
})