import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const connectDb = async() => {
    const url = process.env.MONGO_URL;
    if(!url){
      throw new Error("MONGO_URL is not defind in enviroment variables");  
    }

    try{
     await mongoose.connect(`${url}`,{
        dbName: "ChatappMicroServiceApp",
     });
     console.log("connected to mongodb");
    }catch (error){
      console.error("Failed to connect to Mongodb", error);
      process.exit(1);
    }
}

export default connectDb;