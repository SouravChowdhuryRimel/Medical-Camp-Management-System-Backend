import { Request, Response } from "express";
import { PatientManagementService } from "./patientManagement.service";
import { getPatientModel } from "../patientRegistration/patientRegistration.model";
import { PatientManagementModel } from "./patientManagement.model";
import { CampModel } from "../eventManagements/eventManagement.model";

// ✅ Create patient management
// const createPatientManagement = async (req: Request, res: Response) => {
//   try {
//     const { patientId, campId, status, waitTime } = req.body;

//     // Check if record already exists
//     const existing = await PatientManagementModel.findOne({ patientId });

//     const PatientRegistration = await getPatientModel();

//     const nameKeys = [
//       "name",
//       "Name",
//       "fullName",
//       "FullName",
//       "Full Name",
//       "patient_name",
//     ];
//     let patientName = "Unknown";

//     // Fetch patient from PatientRegistration
//     const patientRecord = await PatientRegistration.findById(patientId).lean();
//     if (!patientRecord) {
//       return res
//         .status(404)
//         .json({ message: "Patient not found in registration" });
//     }

//     // Find the first name field that exists
//     for (const key of nameKeys) {
//       if (patientRecord[key]) {
//         patientName = patientRecord[key];
//         break;
//       }
//     }

//     if (!patientName) {
//       patientName = "Unknown"; // fallback
//     }

//     // Fetch camp from camp model
//     const campRecord = await CampModel.findById(campId).select("campName");
//     if (!campRecord) {
//       return res.status(404).json({ message: "Camp not found in camp model" });
//     }

//     // Create patient management record with name populated
//     const patientManagement =
//       await PatientManagementService.createPatientManagement({
//         patientId,
//         campId,
//         campName: campRecord.campName,
//         patientName,
//         status,
//         waitTime,
//       });

//     res.status(201).json(patientManagement);
//   } catch (error: any) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: error.message || "Error creating patient management" });
//   }
// };

const createPatientManagement = async (req: Request, res: Response) => {
  try {
    const { patientId, campId, status, waitTime } = req.body;

    // Check if record already exists
    const existing = await PatientManagementModel.findOne({ patientId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Patient management already exists" });
    }

    const PatientRegistration = await getPatientModel();

    // Dynamic keys for patient name
    const nameKeys = [
      "name",
      "Name",
      "fullName",
      "FullName",
      "Full Name",
      "patient_name",
    ];

    // Fetch patient from PatientRegistration
    const patientRecord = await PatientRegistration.findById(patientId).lean();
    if (!patientRecord) {
      return res
        .status(404)
        .json({ message: "Patient not found in registration" });
    }

    // Pick the first existing name key from Registration object
    let patientName = "Unknown";
    if (patientRecord.Registration) {
      for (const key of nameKeys) {
        if (patientRecord.Registration[key]) {
          patientName = patientRecord.Registration[key];
          break;
        }
      }
    }

    // Fetch camp from CampModel
    const campRecord = await CampModel.findById(campId).select("campName");
    if (!campRecord) {
      return res.status(404).json({ message: "Camp not found" });
    }

    // Create patient management record
    const patientManagement =
      await PatientManagementService.createPatientManagement({
        patientId,
        campId,
        campName: campRecord.campName,
        patientName, // ✅ now correctly populated
        status,
        waitTime,
      });

    res.status(201).json({
      success: true,
      message: "Patient management created successfully",
      data: patientManagement,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating patient management",
    });
  }
};

// ✅ Get all patient management records
const getAllPatientManagement = async (_req: Request, res: Response) => {
  try {
    const patients = await PatientManagementService.getAllPatientManagement();
    res.json(patients);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || "Error fetching patients" });
  }
};

// ✅ Get single patient management record by ID
const getPatientManagementById = async (req: Request, res: Response) => {
  try {
    const patient = await PatientManagementService.getPatientManagementById(
      req.params.id
    );
    res.json(patient);
  } catch (error: any) {
    console.error(error);
    res.status(404).json({ message: error.message || "Patient not found" });
  }
};

// ✅ Update patient management record
const updatePatientManagement = async (req: Request, res: Response) => {
  try {
    const patient = await PatientManagementService.updatePatientManagement(
      req.params.id,
      req.body
    );
    res.json(patient);
  } catch (error: any) {
    console.error(error);
    res.status(404).json({ message: error.message || "Patient not found" });
  }
};

// ✅ Get all compliance
const getAllCompliance = async (req: Request, res: Response) => {
  try {
    const data = await PatientManagementService.getAllCompliance();
    const complianceData = data.map((item) => ({
      patientManagementId: item._id,
      patientId: item.patientId,
      waitTime: item.waitTime,
      complianceStatus: item.complianceStatus,
    }));
    res.status(200).json({ success: true, data: complianceData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get single compliance
const getSingleCompliance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const data = await PatientManagementService.getSingleCompliance(id);

    const complianceData = {
      patientManagementId: data._id,
      patientId: data.patientId,
      waitTime: data.waitTime,
      complianceStatus: data.complianceStatus,
    };

    res.status(200).json({ success: true, data: complianceData });
  } catch (error: any) {
    if (error.message === "Compliance record not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update compliance status by ID
const updateComplianceStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { complianceStatus } = req.body;

    if (complianceStatus !== "Complete" && complianceStatus !== "Pending") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid complianceStatus value" });
    }

    const updatedRecord = await PatientManagementService.updateComplianceStatus(
      id,
      complianceStatus
    );

    // ✅ Return updated DB record
    const complianceData = {
      patientManagementId: updatedRecord._id,
      patientId: updatedRecord.patientId,
      waitTime: updatedRecord.waitTime,
      complianceStatus: updatedRecord.complianceStatus,
    };

    return res.status(200).json({ success: true, data: complianceData });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Export all patient data as CSV
const exportAllPatientDataCsv = async (req: Request, res: Response) => {
  try {
    const csvData = await PatientManagementService.exportAllPatientDataCsv();
    res.header("Content-Type", "text/csv");
    res.attachment("patient-data.csv");
    return res.send(csvData);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Single exported controller object
export const PatientManagementController = {
  createPatientManagement,
  getAllPatientManagement,
  getPatientManagementById,
  updatePatientManagement,
  getAllCompliance,
  getSingleCompliance,
  updateComplianceStatus,
  exportAllPatientDataCsv,
};
