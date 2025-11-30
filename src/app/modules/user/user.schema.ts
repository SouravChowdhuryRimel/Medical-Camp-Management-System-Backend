import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";

const user_schema = new Schema<TUser>(
  {
    name: { type: String },
    accountId: { type: String, required: false, ref: "account" },
    email: { type: String, required: false },
    image: { type: String, required: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User_Model = model("user", user_schema);
