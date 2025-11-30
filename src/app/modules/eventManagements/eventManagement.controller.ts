import { Request, Response } from "express";
import { EventManagementService } from "./eventManagement.service";
import { reverseGeocode } from "../../utils/reverseGeocode";
import { CampModel } from "./eventManagement.model";

// Create a new camp
// const createCamp = async (req: Request, res: Response) => {
//   try {
//     const camp = await EventManagementService.createCamp(req.body);
//     res.status(201).json(camp);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message || "Error creating camp" });
//   }
// };

const createCamp = async (req: Request, res: Response) => {
  try {
    const {
      campName,
      locationCoords,
      assignAdmin,
      startDate,
      endDate,
      avgTime
    } = req.body;

    // Extract coords
    const [longitude, latitude] = locationCoords.coordinates;

    // Auto-generate readable location
    const location = await reverseGeocode(longitude, latitude);

    // Save to DB
    const newCamp = await CampModel.create({
      campName,
      location,
      assignAdmin,
      startDate,
      endDate,
      avgTime,
      locationCoords
    });

    res.status(201).json({
      success: true,
      data: newCamp
    });
  } catch (error) {
    console.error("Create Camp Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating camp"
    });
  }
};

// Get all camps
const getAllCamps = async (_req: Request, res: Response) => {
  try {
    const camps = await EventManagementService.getAllCamps();
    res.status(200).json(camps);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error fetching camps" });
  }
};

// Get a single camp by ID
const getSingleCamp = async (req: Request, res: Response) => {
  try {
    const camp = await EventManagementService.getSingleCamp(req.params.id);
    res.status(200).json(camp);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "Camp not found" });
  }
};

// Update a camp by ID
const updateCamp = async (req: Request, res: Response) => {
  try {
    const camp = await EventManagementService.updateCamp(req.params.id, req.body);
    res.status(200).json(camp);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "Camp not found" });
  }
};

// Delete a camp by ID
const deleteCamp = async (req: Request, res: Response) => {
  try {
    const result = await EventManagementService.deleteCamp(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "Camp not found" });
  }
};

const getNearbyCampsController = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, maxDistance } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
    }

    const camps = await EventManagementService.findNearbyCamps(
      parseFloat(latitude as string),
      parseFloat(longitude as string),
      maxDistance ? parseInt(maxDistance as string) : 5000
    );

    res.status(200).json({
      success: true,
      data: camps,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const EventManagementController = {
  createCamp,
  getAllCamps,
  getSingleCamp,
  updateCamp,
  deleteCamp,
  getNearbyCampsController,
};
