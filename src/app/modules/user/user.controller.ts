import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { user_services } from "./user.service";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { success } from "zod";

// const createUser = async (req: Request, res: Response) => {
//   try {
//     const user = await user_services.createUser(req.body);
//     res
//       .status(201)
//       .json({ success: true, message: "User create successfully", data: user });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// const getAllUsers = async (_req: Request, res: Response) => {
//   try {
//     const users = await user_services.getAllUsers();
//     res.status(200).json({
//       success: true,
//       message: "Get all user successfully",
//       data: users,
//     });
//   } catch (error: any) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await user_services.getUserById(userId);
    res.status(200).json({
      success: true,
      message: "Get user by userId successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const update_profile = catchAsync(async (req, res) => {
  const result = await user_services.update_profile_into_db(req);
  manageResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile update successful.",
    data: result,
  });
});

export const user_controllers = {
  update_profile,
  // createUser,
  // getAllUsers,
  getUserById,
};
