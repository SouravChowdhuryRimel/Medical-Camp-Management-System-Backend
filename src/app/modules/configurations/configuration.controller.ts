// import { Request, Response } from "express";
// import { configurationService } from "./configuration.service";
// import { PatientRegistration } from "../patientRegistration/patientRegistration.model";

// const createConfiguration = async (req: Request, res: Response) => {
//   try {
//     const { type } = req.params; // registration | consultation | vital-check
//     const { phoneNumber, ...rest } = req.body;

//     // 1️⃣ Create configuration record
//     const payload = { ...rest, phoneNumber, type };
//     const data = await configurationService.createConfiguration(payload);

//     // 2️⃣ Update patient status based on configuration type
//     if (type === "registration" && phoneNumber) {
//       await PatientRegistration.updateMany(
//         { phoneNumber },
//         { $set: { status: "Waiting for Vitals" } }
//       );
//     }

//     if (type === "vital-check" && phoneNumber) {
//       await PatientRegistration.updateMany(
//         { phoneNumber },
//         { $set: { status: "Waiting for Consultation" } }
//       );
//     }

//     if (type === "consultation" && phoneNumber) {
//       await PatientRegistration.updateMany(
//         { phoneNumber },
//         { $set: { status: "Screening Complete" } }
//       );
//     }

//     res.status(201).json({
//       success: true,
//       message: `✅ Configuration for ${type} created successfully`,
//       data,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message:
//         error.message ||
//         `Failed to create configuration for ${req.params.type}`,
//     });
//   }
// };

// export const configurationController = {
//   createConfiguration,
// };

// import { Request, Response } from "express";
// import { configurationService } from "./configuration.service";
// import { success } from "zod";
// import { Message } from "twilio/lib/twiml/MessagingResponse";

// const createOrUpdate = async (req: Request, res: Response) => {
//   try {
//     const { sectionName, fields } = req.body;
//     const result = await configurationService.createOrUpdate(
//       sectionName,
//       fields
//     );
//     res.status(200).json({ success: true, data: result });
//   } catch (error: any) {
//     res.status(500).json({ success: false, Message: error.message });
//   }
// };

// const getAll = async (req: Request, res: Response) => {
//   try {
//     const result = await configurationService.getAll();
//     res.status(200).json({ success: true, data: result });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getBySection = async (req: Request, res: Response) => {
//   try {
//     const { sectionName } = req.params;
//     const result = await configurationService.getBySection(sectionName);
//     res.status(200).json({ success: true, data: result });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const addField = async (req: Request, res: Response) => {
//   try {
//     const { sectionName } = req.params;
//     const field = req.body;
//     const result = await configurationService.addField(sectionName, field);
//     res.status(200).json({ success: true, data: result });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const updateConfigurationField = async (req: Request, res: Response) => {
//   try {
//     const { sectionName, fieldName } = req.params;
//     const updatedProperties = req.body;

//     const updatedConfig = await configurationService.updateConfigurationField(
//       sectionName,
//       fieldName,
//       updatedProperties
//     );

//     res.status(200).json({
//       success: true,
//       message: `Field '${fieldName}' in section '${sectionName}' updated successfully`,
//       data: updatedConfig,
//     });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// const deleteField = async (req: Request, res: Response) => {
//   try {
//     const { sectionName, fieldName } = req.params;
//     const result = await configurationService.deleteField(
//       sectionName,
//       fieldName
//     );
//     res.status(200).json({ success: true, data: result });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const configurationController = {
//   createOrUpdate,
//   getAll,
//   getBySection,
//   addField,
//   updateConfigurationField,
//   deleteField,
// };

import { Request, Response } from "express";
import { configurationService } from "./configuration.service";
import { success } from "zod";
import { Message } from "twilio/lib/twiml/MessagingResponse";

const createOrUpdateConfiguration = async (req: Request, res: Response) => {
  try {
    const { sectionName, fields } = req.body;
    const data = await configurationService.createOrUpdate(sectionName, fields);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllConfigurations = async (req: Request, res: Response) => {
  try {
    const data = await configurationService.getAll();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getConfigurationBySection = async (req: Request, res: Response) => {
  try {
    const { sectionName } = req.params;
    const data = await configurationService.getBySection(sectionName);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addFieldToConfiguration = async (req: Request, res: Response) => {
  try {
    const { sectionName } = req.params;
    const field = req.body;
    const data = await configurationService.addField(sectionName, field);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateConfigurationField = async (req: Request, res: Response) => {
  try {
    const { sectionName, fieldName } = req.params;
    const updatedProperties = req.body;
    const data = await configurationService.updateConfigurationField(
      sectionName,
      fieldName,
      updatedProperties
    );
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteConfigurationField = async (req: Request, res: Response) => {
  try {
    const { sectionName, fieldName } = req.params;
    const data = await configurationService.deleteField(sectionName, fieldName);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteByName = async (req: Request, res: Response) => {
  try {
    const { sectionName } = req.params;
    const deleted = await configurationService.deleteSectionByName(sectionName);
    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: deleted,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Failed to delete section",
    });
  }
};

export const configurationController = {
  createOrUpdateConfiguration,
  getAllConfigurations,
  getConfigurationBySection,
  addFieldToConfiguration,
  updateConfigurationField,
  deleteConfigurationField,
  deleteByName,
};
