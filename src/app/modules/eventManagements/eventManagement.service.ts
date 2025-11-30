import { CampModel } from "./eventManagement.model";
import { ICampCreate, ICampUpdate, ICamp } from "./eventManagement.interface";
import { PatientManagementModel } from "../patientManagements/patientManagement.model";

// Create a new camp
const createCamp = async (payload: ICampCreate): Promise<ICamp> => {
  const camp = await CampModel.create(payload);
  return camp;
};

// Get all camps
const getAllCamps = async (): Promise<ICamp[]> => {
  const camps = await CampModel.find();
  return camps;
};

// Get a single camp by ID
const getSingleCamp = async (id: string): Promise<ICamp> => {
  const camp = await CampModel.findById(id);
  if (!camp) throw new Error("Camp not found");

  // // 🔄 Update totalScreened based on PatientManagement
  // const totalScreened = await PatientManagementModel.countDocuments({
  //   campId: camp._id.toString(),
  //   status: "Screening Complete",
  // });

  // // Only update if it’s different
  // if (camp.totalScreened !== totalScreened) {
  //   camp.totalScreened = totalScreened;
  //   await camp.save();
  // }

    //Count all screened patients
  const totalScreened = await PatientManagementModel.countDocuments({
    campId: camp._id.toString(),
    status: "Screening Complete",
  });

  //Update totalScreened
  camp.totalScreened = totalScreened;

  //Calculate completion percentage
  if (camp.totalEnrolled && camp.totalEnrolled > 0) {
    const completionValue = (totalScreened / camp.totalEnrolled) * 100;
    camp.completion = Math.round(completionValue); // Round to nearest whole %
  } else {
    camp.completion = 0;
  }

  //Save updated values only if changed
  await camp.save();

  return camp;
};

// Update a camp by ID
const updateCamp = async (id: string, payload: ICampUpdate): Promise<ICamp> => {
  const camp = await CampModel.findByIdAndUpdate(id, payload, { new: true });
  if (!camp) throw new Error("Camp not found");
  return camp;
};

// Delete a camp by ID
const deleteCamp = async (id: string): Promise<{ message: string }> => {
  const camp = await CampModel.findByIdAndDelete(id);
  if (!camp) throw new Error("Camp not found");
  return { message: "Camp deleted successfully" };
};

const findNearbyCamps = async (latitude: number, longitude: number, maxDistance = 5000) => {
  const nearbyCamps = await CampModel.find({
    locationCoords: {
      $near: {
        $geometry: { type: "Point", coordinates: [longitude, latitude] },
        $maxDistance: maxDistance, // in meters
      },
    },
  });

  return nearbyCamps;
};

export const EventManagementService = {
  createCamp,
  getAllCamps,
  getSingleCamp,
  updateCamp,
  deleteCamp,
  findNearbyCamps,
};
