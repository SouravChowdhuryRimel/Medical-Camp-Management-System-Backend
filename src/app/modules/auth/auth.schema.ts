import { model, Schema } from "mongoose";
import { TAccount } from "./auth.interface";

const authSchema = new Schema<TAccount>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String, required: false },
    lastPasswordChange: { type: String },
    isDeleted: { type: Boolean, default: false },
    accountStatus: { type: String, default: "ACTIVE" },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "VOLUNTEER", "CLINICIAN", "SuperAdmin"],
      default: "USER",
    },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    otpExpiresAt: { type: Date, default: null },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Account_Model = model("account", authSchema);
