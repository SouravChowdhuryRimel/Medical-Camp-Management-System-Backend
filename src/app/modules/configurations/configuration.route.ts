// import express from "express";
// import { configurationController } from "./configuration.controller";

// const router = express.Router();

// // ✅ Create configuration
// router.post("/create/:type", configurationController.createConfiguration);

// export const configurationRoutes = router;

import express from "express";
import { configurationController } from "./configuration.controller";

const router = express.Router();

router.post("/create-or-update", configurationController.createOrUpdateConfiguration);
router.get("/getAll", configurationController.getAllConfigurations);
router.get("/:sectionName", configurationController.getConfigurationBySection);
router.post("/:sectionName/add-field", configurationController.addFieldToConfiguration);
router.put("/update/:sectionName/field/:fieldName", configurationController.updateConfigurationField);
router.delete("/:sectionName/:fieldName", configurationController.deleteConfigurationField);
router.delete("/delete/by-name/:sectionName",configurationController.deleteByName);


export const configurationRoutes = router;