import { ReportModel } from "./report.model";
import { uploadImgToCloudinary } from "../../utils/cloudinary";
import { IReport } from "./report.interface";
import { PatientManagementModel } from "../patientManagements/patientManagement.model";

const uploadReport = async (
  patientId: string,
  files: Express.Multer.File[]
): Promise<IReport> => {
  try {
    const uploadedFiles: Record<string, string[]> = {};

    // 🖼️ Handle uploaded files - USE THE EXACT SAME PATTERN as patient registration
    if (files) {
      for (const file of files) {
        const fieldName = "reports"; // Fixed field name for reports
        const fileName = `${fieldName}-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;

        const uploadResult = await uploadImgToCloudinary(
          fileName,
          file.path,
          "patients/reports"
        );

        if (!uploadedFiles[fieldName]) uploadedFiles[fieldName] = [];
        uploadedFiles[fieldName].push(uploadResult.secure_url);
      }
    }

    if (!uploadedFiles.reports || uploadedFiles.reports.length === 0) {
      throw new Error("No files were successfully uploaded");
    }

    // 💾 Save - use the exact same pattern
    const newReport = await ReportModel.create({
      patientId: patientId.trim(),
      reports: uploadedFiles.reports,
    });

    // 🔄 Update patientManagement status after report upload
    const updatedPatient = await PatientManagementModel.findOneAndUpdate(
      { patientId: patientId.trim() },
      { status: "Screening Complete" }, // Update to desired status
      { new: true }
    );

    if (!updatedPatient) {
      console.warn(
        `Patient with ID ${patientId} not found in PatientManagement`
      );
    }
    

    return newReport;
  } catch (error) {
    console.error("Error in uploadReport service:", error);
    throw error;
  }
};

const getReports = async (patientId: string): Promise<IReport[]> => {
  try {
    if (!patientId?.trim()) {
      throw new Error("Valid patient ID is required");
    }

    return await ReportModel.find({ patientId: patientId.trim() });
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

export const reportService = {
  uploadReport,
  getReports,
};
