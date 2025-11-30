// userManagement.service.ts
import { UserManagementModel } from "./userManagement.model";
import { Account_Model } from "../auth/auth.schema";
import { ICompanyInformation, IUserManagement } from "./userManagement.interface";
import { TAccount } from "../auth/auth.interface";
import { User_Model } from "../user/user.schema";
import { TUser } from "../user/user.interface";
import bcrypt from "bcrypt";
import { uploadImgToCloudinary } from "../../utils/cloudinary";

const createUserManagement = async (data: IUserManagement) => {
  // 🔐 Hash password before saving
  const hashedPassword = await bcrypt.hash(data.companyInfo.password, 10);

  // Create UserManagement document with hashed password
  const user = await UserManagementModel.create({
    ...data,
    companyInfo: {
      ...data.companyInfo,
      password: hashedPassword,
    },
  });

  // Check if already exists in Auth
  const existingAuth = await Account_Model.findOne({
    email: data.companyInfo.email,
  });

  if (existingAuth) {
    // Update existing Auth account
    existingAuth.role = data.companyInfo.role as TAccount["role"];
    existingAuth.password = hashedPassword;
    existingAuth.isVerified = data.verificationStatus === "verified";
    existingAuth.accountStatus =
      data.status === "active" ? "ACTIVE" : "INACTIVE";
    await existingAuth.save();
  } else {
    // Create new Auth account
    const newAccount = await Account_Model.create({
      name: data.companyInfo.clientName,
      email: data.companyInfo.email,
      password: hashedPassword,
      role: data.companyInfo.role as TAccount["role"],
      isVerified: data.verificationStatus === "verified",
      accountStatus: data.status === "active" ? "ACTIVE" : "INACTIVE",
    });

    // Create linked user entry
    const userPayload: TUser = {
      name: data.companyInfo.clientName,
      accountId: newAccount._id,
    };
    await User_Model.create(userPayload);
  }

  return user;
};


// 🟡 Get all users
const getAllUsers = async () => {
  return await UserManagementModel.find();
};

// 🟠 Get single user by ID
const getSingleUser = async (id: string) => {
  return await UserManagementModel.findById(id);
};

// // 🔵 Update user (and sync with Auth)
// const updateUserManagement = async (
//   id: string,
//   updateData: Partial<IUserManagement>
// ) => {
//   const user = await UserManagementModel.findByIdAndUpdate(id, updateData, {
//     new: true,
//   });
//   if (!user) throw new Error("User not found");

//   const auth = await Account_Model.findOne({ email: user.companyInfo.email });
//   if (auth) {
//     if (updateData.companyInfo?.role) {
//       auth.role = updateData.companyInfo.role as TAccount["role"];
//     }

//     if (updateData.status) {
//       const statusMap: Record<string, TAccount["accountStatus"]> = {
//         active: "ACTIVE",
//         inactive: "INACTIVE",
//         pending: "INACTIVE",
//       };
//       auth.accountStatus = statusMap[updateData.status];
//     }

//     if (updateData.verificationStatus) {
//       auth.isVerified = updateData.verificationStatus === "verified";
//     }

//     await auth.save();
//   }

//   return user;
// };

// 🔵 Update user (with Form-Data + Image Upload)

export const updateUserManagement = async (
  id: string,
  updateData: Partial<IUserManagement>,
  file?: Express.Multer.File
) => {
  const user = await UserManagementModel.findById(id);
  if (!user) throw new Error("User not found");

  const updatePayload: Record<string, any> = {};

  // ----------------------------
  // 🔹 1. Upload Image
  // ----------------------------
  if (file) {
    const uploadResult = await uploadImgToCloudinary(
      `user-${id}-${Date.now()}`,
      file.path,
      "userManagement"
    );

    updatePayload["companyInfo.imageUrl"] = uploadResult.secure_url;
  }

  // ----------------------------
  // 🔹 2. Handle Password
  // ----------------------------
  if (updateData.companyInfo?.password) {
    const hashedPassword = await bcrypt.hash(
      updateData.companyInfo.password,
      10
    );
    updatePayload["companyInfo.password"] = hashedPassword;
  }

  // ----------------------------
  // 🔹 3. Update other fields safely
  // ----------------------------
  if (updateData.companyInfo) {
    type CompanyKeys = keyof ICompanyInformation;

    (Object.keys(updateData.companyInfo) as CompanyKeys[]).forEach((key) => {
      if (key !== "password") {
        updatePayload[`companyInfo.${key}`] =
          updateData.companyInfo?.[key] ?? undefined;
      }
    });
  }

  // ----------------------------
  // 🔹 4. Update main fields
  // ----------------------------
  if (updateData.status) updatePayload.status = updateData.status;
  if (updateData.verificationStatus)
    updatePayload.verificationStatus = updateData.verificationStatus;

  // ----------------------------
  // 🔵 5. Apply Update
  // ----------------------------
  const updatedUser = await UserManagementModel.findByIdAndUpdate(
    id,
    { $set: updatePayload },
    { new: true }
  );

  if (!updatedUser) throw new Error("User update failed");

  // ----------------------------
  // 🔹 6. Sync with Auth model
  // ----------------------------
  const auth = await Account_Model.findOne({
    email: updatedUser.companyInfo.email,
  });

  if (auth) {
    if (updateData.companyInfo?.role) {
      auth.role = updateData.companyInfo.role as TAccount["role"];
    }

    if (updateData.companyInfo?.password) {
      auth.password = updatePayload["companyInfo.password"];
    }

    if (updateData.status) {
      const statusMap: Record<string, TAccount["accountStatus"]> = {
        active: "ACTIVE",
        inactive: "INACTIVE",
        pending: "INACTIVE",
      };
      auth.accountStatus = statusMap[updateData.status];
    }

    if (updateData.verificationStatus) {
      auth.isVerified = updateData.verificationStatus === "verified";
    }

    await auth.save();
  }

  return updatedUser;
};


// 🔴 Delete user
const deleteUserManagement = async (id: string) => {
  const user = await UserManagementModel.findByIdAndDelete(id);
  return user;
};

export const UserManagementService = {
  createUserManagement,
  getAllUsers,
  getSingleUser,
  updateUserManagement,
  deleteUserManagement,
};
