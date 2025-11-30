import { Request } from "express";
import { User_Model } from "./user.schema";
import { Account_Model } from "../auth/auth.schema";
import { TUser } from "./user.interface";
import { upload, uploadImgToCloudinary } from "../../utils/cloudinary";


// Create new user
const createUser = async (payload: TUser) => {
  const user = await User_Model.create(payload);
  return user;
};

// Get all users
const getAllUsers = async () => {
  const users = await User_Model.find();
  return users;
};

// Get single user by id
const getUserById = async (userId: string) => {
  const user = await User_Model.findById(userId);
  return user;
};

const update_profile_into_db = async (req: Request) => {
  try {
    // ✅ Upload file if provided
    if (req.file) {
      const file = req.file;
      const imageName = `profile-${Date.now()}-${file.originalname.split(".")[0]}`;

      const uploadedImage = await uploadImgToCloudinary(
        imageName,
        file.path,
        "user/profiles"
      );

      // Attach the uploaded URL to request body
      req.body.photo = uploadedImage?.secure_url;
    }

    // ✅ Find the account by the authenticated user email
    const isExistUser = await Account_Model.findOne({ email: req?.user?.email }).lean();
    if (!isExistUser) throw new Error("User account not found");

    // ✅ Update user document
    const result = await User_Model.findOneAndUpdate(
      { accountId: isExistUser._id },
      req.body,
      { new: true } // return the updated document
    );

    return result;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};



export const user_services = {
    createUser,
    getAllUsers,
    getUserById,
    update_profile_into_db
}