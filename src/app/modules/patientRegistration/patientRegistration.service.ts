import { PatientManagementModel } from "../patientManagements/patientManagement.model";
import { getPatientModel } from "./patientRegistration.model";

export const createPatientRegistration = async (payload: any) => {
  const PatientModel = await getPatientModel();
  const patient = new PatientModel(payload);
  console.log("patient form", patient);
  return await patient.save();
};


export const getAllPatients = async () => {
  const PatientModel = await getPatientModel();
  return await PatientModel.find();
};

export const getPatientById = async (id: string) => {
  const PatientModel = await getPatientModel();
  return await PatientModel.findById(id);
};


// export const updatePatientRegistration = async (id: string, payload: any) => {
//   const PatientModel = await getPatientModel();
//   return await PatientModel.findByIdAndUpdate(id, payload, { new: true });
// };

export const updatePatientRegistration = async (id: string, payload: any) => {
  const PatientModel = await getPatientModel();

  // Get existing patient
  const existing = await PatientModel.findById(id);
  if (!existing) return null;

  // Merge new data into existing data
  for (const key in payload) {
    if (!payload[key]) continue; // skip empty or undefined fields

    // If section exists, merge fields
    if (typeof payload[key] === "object" && !Array.isArray(payload[key])) {
      existing[key] = { ...existing[key]?.toObject(), ...payload[key] };
    } else {
      existing[key] = payload[key];
    }
  }

  return await existing.save();
};

export const deletePatient = async (id: string) => {
  const PatientModel = await getPatientModel();
  const patient = await PatientModel.findByIdAndDelete(id);
  if (!patient) throw new Error("Patient not found");
  return patient;
};

export const saveFullReport = async (patientId: string, report: any) => {
  const Patient = await getPatientModel();

  const updated = await Patient.findByIdAndUpdate(
    patientId,
    {
      report: report,                    // store full report JSON
      reportGeneratedAt: new Date(),     // timestamp
      reportStatus: "Generated"
    },
    { new: true }
  );

  return updated;
};

export const getReportByPatientId = async (patientId: string) => {
  const Patient = await getPatientModel();

  const patient = await Patient.findById(patientId).select("report reportStatus reportGeneratedAt");

  return patient;
};

// List of possible dynamic name keys
const nameKeys = ["name", "fullName", "FullName", "Full Name", "patient_name"];

export const getAllReportsService = async () => {
  const Patient = await getPatientModel();

  // Fetch all patients that have a report
  const patientsWithReports = await Patient.find({ report: { $exists: true, $ne: null } })
    .sort({ reportGeneratedAt: -1 });

  // Map each patient to include a unified patientName
  const formattedReports = patientsWithReports.map((patient: any) => {
    const patientObj = patient.toObject();

    let patientName: string | null = null;

    // Loop through all sections to find a field that matches nameKeys
    for (const section of Object.keys(patientObj)) {
      const sectionData = patientObj[section];

      if (typeof sectionData === "object" && sectionData !== null) {
        for (const key of Object.keys(sectionData)) {
          if (nameKeys.includes(key)) {
            patientName = sectionData[key];
            break;
          }
        }
      }

      if (patientName) break;
    }

    return {
      _id: patientObj._id,
      patientName: patientName || null,
      report: patientObj.report,
      reportStatus: patientObj.reportStatus,
      reportGeneratedAt: patientObj.reportGeneratedAt
    };
  });

  return formattedReports;
};