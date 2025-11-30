// import { Request, Response } from "express";
// import { getPatientModel } from "./patientRegistration.model";
// import { uploadImgToCloudinary } from "../../utils/cloudinary";
// import { Configuration } from "../configurations/configuration.model";
// import { getAllReportsService, getReportByPatientId, saveFullReport, updatePatientRegistration } from "./patientRegistration.service";

// /**
//  * 🧩 Utility — normalize non-file field data
//  * - Converts single-item arrays into values
//  * - Parses JSON strings safely
//  */
// const normalizePatientData = (
//   data: Record<string, any>,
//   uploadedFiles: Record<string, string[]>
// ) => {
//   console.log("NORMALIZE INPUT BODY ->", data);
//   console.log("NORMALIZE INPUT FILES ->", uploadedFiles);
//   for (const key in data) {
//     if (Array.isArray(data[key]) && !uploadedFiles[key]) {
//       data[key] = data[key][0]; // keep only the first element if not a file field
//     }

//     if (typeof data[key] === "string") {
//       try {
//         data[key] = JSON.parse(data[key]);
//       } catch {
//         // ignore JSON parse errors
//       }
//     }
//   }
//   return data;
// };

// /**
//  * 🧠 Utility — group data by configuration section
//  */
// const organizePatientData = (
//   data: Record<string, any>,
//   uploadedFiles: Record<string, string[]>,
//   configs: any[]
// ) => {
//   console.log("CONFIGS ->", configs);
//   console.log("PARSED ->", data);
//   const organized: Record<string, any> = {};

//   configs.forEach((section) => {
//     organized[section.sectionName] = {};
//     section.fields.forEach((field: any) => {
//       const name = field.fieldName;
//       if (uploadedFiles[name]) {
//         organized[section.sectionName][name] = uploadedFiles[name];
//       } else if (data[name] !== undefined) {
//         organized[section.sectionName][name] = data[name];
//       }
//     });
//   });

//   // Add general fields not part of configurations
//   if (data.campName) organized.campName = data.campName;

//   return organized;
// };

// /**
//  * 🧾 Create patient
//  */
// export const createPatient = async (req: Request, res: Response) => {
//   try {
//     const PatientModel = await getPatientModel();
//     const uploadedFiles: Record<string, string[]> = {};
//     const configs = await Configuration.find();

//     // 🖼️ Handle uploaded files
//     if (req.files) {
//       const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//       for (const [fieldName, fileArray] of Object.entries(files)) {
//         for (const file of fileArray) {
//           const fileName = `${fieldName}-${Date.now()}-${Math.random()
//             .toString(36)
//             .substring(2, 9)}`;
//           const uploadResult = await uploadImgToCloudinary(
//             fileName,
//             file.path,
//             "patients/reports"
//           );
//           if (!uploadedFiles[fieldName]) uploadedFiles[fieldName] = [];
//           uploadedFiles[fieldName].push(uploadResult.secure_url);
//         }
//       }
//     }

//     // 🧩 Normalize and group data
//     let patientData = normalizePatientData(req.body, uploadedFiles);
//     const organizedData = organizePatientData(patientData, uploadedFiles, configs);

//     // 💾 Save
//     const patient = await PatientModel.create(organizedData);

//     res.status(201).json({
//       success: true,
//       message: "Patient registered successfully",
//       data: patient,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: error.message || "Failed to create patient",
//     });
//   }
// };

// /**
//  * 📋 Get all patients
//  */
// export const getAllPatients = async (_req: Request, res: Response) => {
//   try {
//     const PatientModel = await getPatientModel();
//     const patients = await PatientModel.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: patients });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// /**
//  * 🔍 Get patient by ID
//  */
// export const getPatientById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const PatientModel = await getPatientModel();
//     const patient = await PatientModel.findById(id);
//     if (!patient) throw new Error("Patient not found");
//     res.status(200).json({ success: true, data: patient });
//   } catch (error: any) {
//     res.status(404).json({ success: false, message: error.message });
//   }
// };

// /**
//  * ✏️ Update patient
//  */
// // export const updatePatient = async (req: Request, res: Response) => {
// //   try {
// //     const { id } = req.params;
// //     const PatientModel = await getPatientModel();
// //     const uploadedFiles: Record<string, string[]> = {};
// //     const configs = await Configuration.find();

// //     // 🖼️ Handle uploaded files
// //     if (req.files) {
// //       const files = req.files as { [fieldname: string]: Express.Multer.File[] };
// //       for (const [fieldName, fileArray] of Object.entries(files)) {
// //         for (const file of fileArray) {
// //           const fileName = `${fieldName}-${Date.now()}-${Math.random()
// //             .toString(36)
// //             .substring(2, 9)}`;
// //           const uploadResult = await uploadImgToCloudinary(
// //             fileName,
// //             file.path,
// //             "patients/reports"
// //           );
// //           if (!uploadedFiles[fieldName]) uploadedFiles[fieldName] = [];
// //           uploadedFiles[fieldName].push(uploadResult.secure_url);
// //         }
// //       }
// //     }

// //     // 🧩 Normalize and group updated data
// //     let patientData = normalizePatientData(req.body, uploadedFiles);
// //     const organizedData = organizePatientData(patientData, uploadedFiles, configs);

// //     // 💾 Update
// //     const patient = await PatientModel.findByIdAndUpdate(id, organizedData, { new: true });
// //     if (!patient) throw new Error("Patient not found");

// //     res.status(200).json({
// //       success: true,
// //       message: "Patient updated successfully",
// //       data: patient,
// //     });
// //   } catch (error: any) {
// //     res.status(400).json({
// //       success: false,
// //       message: error.message || "Failed to update patient",
// //     });
// //   }
// // };


// export const updatePatient = async (req: Request, res: Response) => {
//   try {
//     const patientId = req.params.id;
//     const uploadedFiles: Record<string, string[]> = {};
//     const configs = await Configuration.find();

//     // File uploads
//     if (req.files) {
//       const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//       for (const [fieldName, fileArray] of Object.entries(files)) {
//         for (const file of fileArray) {
//           const uniqueName = `${fieldName}-${Date.now()}`;
//           const uploadResult = await uploadImgToCloudinary(
//             uniqueName,
//             file.path,
//             "patients/reports"
//           );

//           if (!uploadedFiles[fieldName]) uploadedFiles[fieldName] = [];
//           uploadedFiles[fieldName].push(uploadResult.secure_url);
//         }
//       }
//     }

//     let parsed = normalizePatientData(req.body, uploadedFiles);
//     const organizedData = organizePatientData(parsed, uploadedFiles, configs);

//     const updated = await updatePatientRegistration(patientId, organizedData);

//     if (!updated) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Patient not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Patient updated successfully",
//       data: updated,
//     });
//   } catch (err: any) {
//     res.status(500).json({
//       success: false,
//       message: err.message || "Failed to update patient",
//     });
//   }
// };

// /**
//  * 🗑️ Delete patient
//  */
// export const deletePatient = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const PatientModel = await getPatientModel();
//     const patient = await PatientModel.findByIdAndDelete(id);
//     if (!patient) throw new Error("Patient not found");

//     res.status(200).json({
//       success: true,
//       message: "Patient deleted successfully",
//       data: patient,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: error.message || "Failed to delete patient",
//     });
//   }
// };

// export const storeGeneratedReport = async (req: Request, res: Response) => {
//   try {
//     const reportData = req.body;    // your full JSON object
//     const patientId = reportData.patient_id;

//     if (!patientId) {
//       return res.status(400).json({ message: "patient_id is required" });
//     }

//     const saved = await saveFullReport(patientId, reportData);

//     return res.status(200).json({
//       success: true,
//       message: "Report saved successfully",
//       data: saved
//     });

//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to save report",
//       error: error.message
//     });
//   }
// };

// export const getAllReports = async (req: Request, res: Response) => {
//   try {
//     const reports = await getAllReportsService();

//     res.status(200).json({
//       success: true,
//       message: "Reports fetched successfully",
//       data: reports
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch reports",
//       error: error.message
//     });
//   }
// };

// export const fetchReport = async (req: Request, res: Response) => {
//   try {
//     const { patientId } = req.params;

//     const Patient = await getPatientModel();
//     const patient = await Patient.findById(patientId);

//     if (!patient) {
//       return res.status(404).json({ success: false, message: "Patient not found" });
//     }

//     // ---------------------------------------
//     // ⭐ Automatically find name in ANY section
//     // ---------------------------------------
//     let fullName: string | null = null;

//     const nameKeys = ["name", "fullName", "FullName", "Full Name", "patient_name"];

//     for (const section of Object.keys(patient.toObject())) {
//       const sectionData = patient[section];

//       if (typeof sectionData === "object" && sectionData !== null) {
//         for (const key of Object.keys(sectionData)) {
//           if (nameKeys.includes(key)) {
//             fullName = sectionData[key];
//             break;
//           }
//         }
//       }

//       if (fullName) break;
//     }

//     return res.status(200).json({
//       success: true,
//       fullName: fullName || null,   // ⭐ return name
//       report: patient.report,
//       reportStatus: patient.reportStatus,
//       reportGeneratedAt: patient.reportGeneratedAt
//     });

//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch report",
//       error: error.message
//     });
//   }
// };


import { Request, Response } from "express";
import { getPatientModel } from "./patientRegistration.model";
import { uploadImgToCloudinary } from "../../utils/cloudinary";
import { Configuration } from "../configurations/configuration.model";
import {
  getAllReportsService,
  saveFullReport,
  updatePatientRegistration as serviceUpdatePatient,
} from "./patientRegistration.service";

/**
 * 🧩 Normalize non-file fields safely
 */
const normalizePatientData = (data: Record<string, any>, uploadedFiles: Record<string, string[]>) => {
  const result: Record<string, any> = {};
  for (const key in data) {
    if (!key) continue;

    // Use uploaded file if available
    if (uploadedFiles[key]) {
      result[key] = uploadedFiles[key];
      continue;
    }

    // Convert single-item arrays to single value
    if (Array.isArray(data[key])) result[key] = data[key][0];
    else result[key] = data[key];

    // Try JSON parse
    if (typeof result[key] === "string") {
      try {
        result[key] = JSON.parse(result[key]);
      } catch {
        // keep string as-is
      }
    }
  }
  return result;
};

/**
 * 🧠 Organize data by configuration sections
 */
const organizePatientData = (
  data: Record<string, any>,
  uploadedFiles: Record<string, string[]>,
  configs: any[]
) => {
  const organized: Record<string, any> = {};

  configs.forEach((section) => {
    organized[section.sectionName] = {};
    section.fields.forEach((field: any) => {
      const name = field.fieldName;
      if (!name) return;

      if (uploadedFiles[name]) {
        organized[section.sectionName][name] = uploadedFiles[name];
      } else if (data[name] !== undefined) {
        organized[section.sectionName][name] = data[name];
      }
    });
  });

  // Extra general fields
  if (data.campName) organized.campName = data.campName;

  return organized;
};

/**
 * 🧾 Create patient
 */
export const createPatient = async (req: Request, res: Response) => {
  try {
    const PatientModel = await getPatientModel();
    const uploadedFiles: Record<string, string[]> = {};
    const configs = await Configuration.find();

    // Handle file uploads
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      for (const [fieldName, fileArray] of Object.entries(files)) {
        for (const file of fileArray) {
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
    }

    const normalized = normalizePatientData(req.body, uploadedFiles);
    const organized = organizePatientData(normalized, uploadedFiles, configs);

    const patient = await PatientModel.create(organized);

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: patient,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create patient",
    });
  }
};

/**
 * 📋 Get all patients
 */
export const getAllPatients = async (_req: Request, res: Response) => {
  try {
    const PatientModel = await getPatientModel();
    const patients = await PatientModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: patients });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * 🔍 Get patient by ID
 */
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const PatientModel = await getPatientModel();
    const patient = await PatientModel.findById(id);

    if (!patient) throw new Error("Patient not found");

    res.status(200).json({ success: true, data: patient });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

/**
 * ✏️ Update patient (partial update, preserves existing fields)
 */
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const patientId = req.params.id;
    const uploadedFiles: Record<string, string[]> = {};
    const configs = await Configuration.find();

    // Handle file uploads
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      for (const [fieldName, fileArray] of Object.entries(files)) {
        for (const file of fileArray) {
          const fileName = `${fieldName}-${Date.now()}`;
          const uploadResult = await uploadImgToCloudinary(
            fileName,
            file.path,
            "patients/reports"
          );
          if (!uploadedFiles[fieldName]) uploadedFiles[fieldName] = [];
          uploadedFiles[fieldName].push(uploadResult.secure_url);
        }
      }
    }

    const normalized = normalizePatientData(req.body, uploadedFiles);
    const organized = organizePatientData(normalized, uploadedFiles, configs);

    // Use service to merge with existing data
    const updated = await serviceUpdatePatient(patientId, organized);

    if (!updated) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update patient",
    });
  }
};

/**
 * 🗑️ Delete patient
 */
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const PatientModel = await getPatientModel();
    const deleted = await PatientModel.findByIdAndDelete(id);

    if (!deleted) throw new Error("Patient not found");

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
      data: deleted,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete patient",
    });
  }
};

/**
 * 📝 Save generated report
 */
export const storeGeneratedReport = async (req: Request, res: Response) => {
  try {
    const reportData = req.body;
    const patientId = reportData.patient_id;

    if (!patientId) {
      return res.status(400).json({ message: "patient_id is required" });
    }

    const saved = await saveFullReport(patientId, reportData);

    res.status(200).json({
      success: true,
      message: "Report saved successfully",
      data: saved,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to save report",
      error: error.message,
    });
  }
};

/**
 * 📤 Fetch all reports
 */
export const getAllReports = async (_req: Request, res: Response) => {
  try {
    const reports = await getAllReportsService();
    res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      data: reports,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

/**
 * 📄 Fetch single report with auto-detected patient name
 */
export const fetchReport = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const Patient = await getPatientModel();
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    let fullName: string | null = null;
    const nameKeys = ["Name", "name", "fullName", "FullName", "Full Name", "patient_name"];

    for (const section of Object.keys(patient.toObject())) {
      const sectionData = patient[section];
      if (sectionData && typeof sectionData === "object") {
        for (const key of Object.keys(sectionData)) {
          if (nameKeys.includes(key)) {
            fullName = sectionData[key];
            break;
          }
        }
      }
      if (fullName) break;
    }

    res.status(200).json({
      success: true,
      fullName: fullName || null,
      report: patient.report,
      reportStatus: patient.reportStatus,
      reportGeneratedAt: patient.reportGeneratedAt,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch report",
      error: error.message,
    });
  }
};
