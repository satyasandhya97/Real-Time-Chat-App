import mongoose, { Document, Schema as MongooseSchema } from "mongoose";

export interface IChat extends Document {
  users: string[];
  latestMessage?: {
    text: string;
    sender: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: MongooseSchema<IChat> = new MongooseSchema(
  {
    users: [{ type: String, required: true }],
    latestMessage: {
      text: { type: String },
      sender: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export const Chat =  mongoose.model<IChat>("Chat", ChatSchema);
