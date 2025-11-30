import mongoose, { Document, Schema, Model } from "mongoose";
import { keyContact } from "./keyContact.interface";

export interface IKeyContact extends keyContact, Document {}

const KeyContactSchema: Schema<IKeyContact> = new Schema(
  {
    leadCampAdmin: { type: String, required: true },
    leadClinician: { type: String, required: true },
    EmergencyContact: { type: String, required: true },
  },
  { timestamps: true }
);

export const KeyContactModel: Model<IKeyContact> = mongoose.model<IKeyContact>(
  "KeyContact",
  KeyContactSchema
);
