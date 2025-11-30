// userManagement.model.ts
import { Schema, model, Document } from "mongoose";
import { IUserManagement, ICompanyInformation, IReferrerInformation } from "./userManagement.interface";

export interface IUserManagementDocument extends IUserManagement, Document {}

const CompanyInformationSchema = new Schema<ICompanyInformation>(
  {
    clientName: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    imageUrl: { type: String }, // Optional field
    password: { type: String, required: true },
    isReferred: { type: Boolean, default: false },
  },
  { _id: false }
);

const ReferrerInformationSchema = new Schema<IReferrerInformation>(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    referralSource: { type: String, required: true },
    isVisibleToClient: { type: Boolean, default: true },
  },
  { _id: false }
);

const UserManagementSchema = new Schema<IUserManagementDocument>(
  {
    companyInfo: { type: CompanyInformationSchema, required: true },
    referrerInfo: { type: ReferrerInformationSchema },
    status: { type: String, enum: ["active", "inactive", "pending"], default: "pending", required: true },
    verificationStatus: { type: String, enum: ["verified", "unverified", "pending"], default: "pending", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const UserManagementModel = model<IUserManagementDocument>(
  "UserManagement",
  UserManagementSchema
);
