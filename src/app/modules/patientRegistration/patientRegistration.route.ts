// import express from "express";
// import * as patientController from "./patientRegistration.controller";
// import multer from "multer";
// import { Configuration } from "../configurations/configuration.model";

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// // Middleware: get all file fields from all sections
// const dynamicMulterMiddleware = async (req: any, res: any, next: any) => {
//   try {
//     const allConfigs = await Configuration.find();
//     if (!allConfigs || allConfigs.length === 0)
//       throw new Error("No configuration found");

//     const fileFields: string[] = [];
//     allConfigs.forEach((section) => {
//       section.fields
//         .filter((f) => f.fieldType === "file")
//         .forEach((f) => fileFields.push(f.fieldName));
//     });

//     const multerFields = fileFields.map((name) => ({ name, maxCount: 5 }));
//     const dynamicUpload = multer({ dest: "uploads/" }).fields(multerFields);

//     dynamicUpload(req, res, (err) => {
//       if (err)
//         return res.status(400).json({ success: false, message: err.message });
//       next();
//     });
//   } catch (err: any) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Create patient
// router.post(
//   "/create",
//   dynamicMulterMiddleware,
//   patientController.createPatient
// );
// //Update patient
// router.patch(
//   "/update/:id",
//   dynamicMulterMiddleware,
//   patientController.updatePatient
// );

// //Save generated report
// router.post("/save-report", patientController.storeGeneratedReport);

// //Get all reports
// router.get("/reports", patientController.getAllReports);

// //Get single report by patient ID
// router.get("/get-report/:patientId", patientController.fetchReport);

// //Get all patients
// router.get("/getAll", patientController.getAllPatients);

// //Patient CRUD operations (must come after static routes)
// router.get("/:id", patientController.getPatientById);
// // router.put("/updatePatient/:id", dynamicMulterMiddleware, patientController.updatePatient);
// router.delete("/:id", patientController.deletePatient);

// export const PatientRegistrationRoutes = router;

import express from "express";
import * as patientController from "./patientRegistration.controller";
import multer from "multer";
import { Configuration } from "../configurations/configuration.model";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * Middleware: dynamically generate multer fields from configuration
 */
const dynamicMulterMiddleware = async (req: any, res: any, next: any) => {
  try {
    const allConfigs = await Configuration.find();
    if (!allConfigs || allConfigs.length === 0)
      return res.status(500).json({ success: false, message: "No configuration found" });

    const fileFields: string[] = [];
    allConfigs.forEach((section) => {
      section.fields
        .filter((f) => f.fieldType === "file")
        .forEach((f) => fileFields.push(f.fieldName));
    });

    const multerFields = fileFields.map((name) => ({ name, maxCount: 5 }));
    const dynamicUpload = multer({ dest: "uploads/" }).fields(multerFields);

    dynamicUpload(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      next(); // ✅ call next() correctly
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ───── PATIENT CRUD ─────
router.post("/create", dynamicMulterMiddleware, patientController.createPatient);
router.patch("/update/:id", dynamicMulterMiddleware, patientController.updatePatient);
router.get("/getAll", patientController.getAllPatients);
router.get("/:id", patientController.getPatientById);
router.delete("/:id", patientController.deletePatient);

// ───── REPORTS ─────
router.post("/save-report", patientController.storeGeneratedReport);
router.get("/reports", patientController.getAllReports);
router.get("/get-report/:patientId", patientController.fetchReport);

export const PatientRegistrationRoutes = router;
