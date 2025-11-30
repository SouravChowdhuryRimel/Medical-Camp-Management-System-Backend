import express from "express";
import { UserManagementController } from "./userManagement.controller";
import { uploadSingle } from "../../utils/cloudinary";

const router = express.Router();

router.post("/create",uploadSingle, UserManagementController.createUserManagement);
router.get("/getAll", UserManagementController.getAllUserManagement);
router.get("/getSingle/:id", UserManagementController.getSingleUserManagement);
router.put("/update/:id",uploadSingle, UserManagementController.updateUserManagement);
router.delete("/delete/:id", UserManagementController.deleteUserManagement);

export const UserManagementRoutes = router;