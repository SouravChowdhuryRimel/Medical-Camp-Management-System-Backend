// userManagement.controller.ts
import { Request, Response } from "express";
import { UserManagementService } from "./userManagement.service";
import { uploadImgToCloudinary } from "../../utils/cloudinary";

// 🟢 Create new user

const createUserManagement = async (req: Request, res: Response) => {
  try {
    let imageUrl = "";

    // If file uploaded
    if (req.file) {
      const originalName = req.file.originalname.split(".")[0];
      const cloudFile = await uploadImgToCloudinary(
        originalName,
        req.file.path,
        "user-management"
      );

      imageUrl = cloudFile.secure_url;
    }

    const payload = {
      ...req.body,
      companyInfo: {
        ...JSON.parse(req.body.companyInfo),
        imageUrl,
      },
      referrerInfo: req.body.referrerInfo
        ? JSON.parse(req.body.referrerInfo)
        : undefined,
    };

    const result = await UserManagementService.createUserManagement(payload);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create user",
    });
  }
};


// 🟡 Get all users
const getAllUserManagement = async (req: Request, res: Response) => {
  try {
    const users = await UserManagementService.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

// 🟠 Get single user by ID
const getSingleUserManagement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserManagementService.getSingleUser(id);

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user",
    });
  }
};

// 🔵 Update user
// const updateUserManagement = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updated = await UserManagementService.updateUserManagement(id, req.body);
//     res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: updated,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update user",
//     });
//   }
// };

const updateUserManagement = async (req: Request, res: Response) => {
  try {
    const result = await UserManagementService.updateUserManagement(
      req.params.id,
      req.body,
      req.file // ⬅️ image from form-data
    );

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔴 Delete user
const deleteUserManagement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await UserManagementService.deleteUserManagement(id);

    if (!deleted)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};

export const UserManagementController = {
    createUserManagement,
    getAllUserManagement,
    getSingleUserManagement,
    updateUserManagement,
    deleteUserManagement,
};