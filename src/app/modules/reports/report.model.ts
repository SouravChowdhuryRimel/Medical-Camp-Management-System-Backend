import { Schema, model } from "mongoose";
import { IReport } from "./report.interface";

const reportSchema = new Schema<IReport>(
  {
    patientId: { type: String, required: true },
    reports: { type: [String], required: true }
  },
  { timestamps: true }
);

export const ReportModel = model<IReport>("Report", reportSchema);
