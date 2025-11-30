import express from "express";
import multer from "multer";
import { reportController } from "./report.controller";

const router = express.Router();

// Use the same multer configuration as patient registration
const upload = multer({ dest: "uploads/" });

// Simple route - no dynamic middleware needed for reports
router.post("/upload", upload.array("reports", 10), reportController.uploadReport);
router.get("/getSingleReport/:patientId", reportController.getReports);

export const reportRoutes = router;