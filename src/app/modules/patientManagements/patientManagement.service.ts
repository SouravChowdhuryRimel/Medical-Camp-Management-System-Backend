import { PatientManagementModel } from "./patientManagement.model";
import { IpatientManagement } from "./patientManagement.interface";
import { Parser } from "json2csv"; // ✅ add this import
import { getPatientModel } from "../patientRegistration/patientRegistration.model";
import { CampModel } from "../eventManagements/eventManagement.model";

// ✅ Create a patient management record
const createPatientManagement = async (payload: IpatientManagement) => {
  const patient = await PatientManagementModel.create(payload);
  const camp = await CampModel.findById(payload.campId);

  const PatientRegistration = await getPatientModel();

  if (payload.patientId) {
    await PatientRegistration.findByIdAndUpdate(
      payload.patientId,
      { status: payload.status },
      { new: true }
    );
  }
  if (payload.campId) {
    await PatientRegistration.findByIdAndUpdate(
      payload.patientId,
      { campName: camp?.campName },
      { new: true }
    );
  }
  // 3️⃣ Recalculate camp stats
  if (payload.campId) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Count patients enrolled today for this camp
    const patientToday = await PatientManagementModel.countDocuments({
      campId: payload.campId,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    // Count total patients for this camp
    const totalPatients = await PatientManagementModel.countDocuments({
      campId: payload.campId,
    });

    // Count patients with Screening Complete
    const screenedPatients = await PatientManagementModel.countDocuments({
      campId: payload.campId,
      status: "Screening Complete",
    });

    const completion =
      totalPatients > 0 ? (screenedPatients / totalPatients) * 100 : 0;

    // Update camp stats
    await CampModel.findByIdAndUpdate(payload.campId, {
      patientToday,
      completion: parseFloat(completion.toFixed(2)),
      totalEnrolled: totalPatients,
    });
  }
  return patient;
};

// ✅ Get all patient management records
const getAllPatientManagement = async () => {
  const patients = await PatientManagementModel.find().sort({ createdAt: -1 });
  return patients;
};

// ✅ Get a single patient management record by ID
const getPatientManagementById = async (id: string) => {
  const patient = await PatientManagementModel.findById(id);

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
};

// ✅ Update patient management record by ID
const updatePatientManagement = async (
  id: string,
  updateData: Partial<IpatientManagement>
) => {
  const patient = await PatientManagementModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  if (!patient) {
    throw new Error("Patient not found");
  }
  const PatientRegistration = await getPatientModel();

  if (patient.patientId) {
    await PatientRegistration.findByIdAndUpdate(
      patient.patientId,
      { status: patient.status },
      { new: true }
    );
  }
  // 3️⃣ Recalculate camp completion
  if (patient.campId) {
    const totalPatients = await PatientManagementModel.countDocuments({
      campId: patient.campId,
    });

    const screenedPatients = await PatientManagementModel.countDocuments({
      campId: patient.campId,
      status: "Screening Complete",
    });

    const completion =
      totalPatients > 0 ? (screenedPatients / totalPatients) * 100 : 0;

    await CampModel.findByIdAndUpdate(patient.campId, {
      completion: parseFloat(completion.toFixed(2)),
    });
  }

  return patient;
};

// ✅ Get all compliance data
const getAllCompliance = async () => {
  const records = await PatientManagementModel.find().sort({ createdAt: -1 });

  // compute complianceStatus but don't update DB
  const formatted = records.map((p) => ({
    ...p.toObject(),
    complianceStatus:
      p.status === "Screening Complete" ? "Complete" : "Pending",
  }));

  return formatted;
};

// ✅ Get single compliance by ID
const getSingleCompliance = async (id: string) => {
  const record = await PatientManagementModel.findById(id);

  if (!record) {
    throw new Error("Compliance record not found");
  }

  return {
    ...record.toObject(),
    complianceStatus:
      record.status === "Screening Complete" ? "Complete" : "Pending",
  };
};

// Update comlianceStatus based on patientManagementId
const updateComplianceStatus = async (
  id: string,
  complianceStatus: "Complete" | "Pending"
) => {
  const record = await PatientManagementModel.findById(id);

  if (!record) throw new Error("Patient management record not found");

  // ✅ Update DB
  record.complianceStatus = complianceStatus;
  record.status =
    complianceStatus === "Complete" ? "Screening Complete" : record.status;
  await record.save(); // <-- This saves to MongoDB

  return record;
};

// ✅ Export all patient data as CSV
const exportAllPatientDataCsv = async () => {
  const patients = await PatientManagementModel.find().lean();
  if (!patients || patients.length === 0) return "";

  const fields = [
    "_id",
    "patientId",
    "patientName",
    "waitTime",
    "complianceStatus",
  ];
  const parser = new Parser({ fields });
  const csv = parser.parse(patients);
  return csv;
};

// ✅ Single exported service object
export const PatientManagementService = {
  createPatientManagement,
  getAllPatientManagement,
  getPatientManagementById,
  updatePatientManagement,
  getAllCompliance,
  getSingleCompliance,
  updateComplianceStatus,
  exportAllPatientDataCsv,
};
