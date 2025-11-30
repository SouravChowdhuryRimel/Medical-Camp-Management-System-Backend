import { Router } from "express";
import { PatientManagementController } from "./patientManagement.controller";

const router = Router();

// ✅ Create patient management record
router.post("/create", PatientManagementController.createPatientManagement);

// ✅ Get all patient management records
router.get("/getAll", PatientManagementController.getAllPatientManagement);

// ✅ Get single patient management record by ID
router.get(
  "/getSingle/:id",
  PatientManagementController.getPatientManagementById
);

// ✅ Update patient management record by ID
router.put("/update/:id", PatientManagementController.updatePatientManagement);
// ✅ Get all patient compliance records
router.get("/getAllCompliance", PatientManagementController.getAllCompliance);

// Get single compliance record
router.get(
  "/getSingleCompliance/:id",
  PatientManagementController.getSingleCompliance
);

// Update compliance status
router.put(
  "/updateComplianceStatus/:id",PatientManagementController.updateComplianceStatus);

// Export all patient data as CSV
router.get("/allCompliance/export/csv", PatientManagementController.exportAllPatientDataCsv);

export const patientManagementRoute = router;
