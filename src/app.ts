import express, { Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/global_error_handler";
import notFound from "./app/middlewares/not_found_api";
import cookieParser from "cookie-parser";
import appRouter from "./routes";
import { Account_Model } from "./app/modules/auth/auth.schema";
import bcrypt from "bcrypt";
import { configs } from "./app/configs";
import { User_Model } from "./app/modules/user/user.schema";

// Cron job for auto-updating camp status
import "./app/modules/eventManagements/autoStatusUpdate";

// define app
const app = express();
// Important: parse JSON bodies
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://dockmnk.netlify.app",
      "https://medixcamp.com",
      "*",
    ],
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: "*",
//     methods: "GET,POST,PUT,DELETE,PATCH",
//     credentials: true,
//   })
// );

app.use(express.json({ limit: "100mb" }));
app.use(express.raw());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", appRouter);

// stating point
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running successful !!",
    data: null,
  });
});

// Create Default SuperAdmin if not exists
export const createDefaultSuperAdmin = async () => {
  try {
    const existingAdmin = await Account_Model.findOne({
      email: "mohit.naren@gmail.com",
    });

    const hashedPassword = await bcrypt.hash(
      "Mohit@334", // Default password for Admin
      Number(configs.bcrypt.salt_rounds) // Ensure bcrypt_salt_rounds is correctly pulled from config
    ); 

    if (!existingAdmin) {
      const newAccount = await Account_Model.create({
        name: "Mohit Naren",
        email: "mohit.naren@gmail.com",
        image: "https://res.cloudinary.com/dsi00lpgf/image/upload/v1764309074/photo_2025-11-28_10-31-09_oc9a3d.jpg",
        password: hashedPassword,
        confirmPassword: hashedPassword,
        role: "SuperAdmin",
        country: "Global",
        isVerified: true,
      });
      // Create user associated with the account
      const userPayload = {
        name: "docmnk SuperAdmin", // Use the same name from account
        accountId: newAccount._id, // Use the created account's ID
      };

      await User_Model.create(userPayload);
      console.log("✅ Default Admin created.");
    } else {
      console.log("ℹ️ SAdmin already exists.");
    }
  } catch (error) {
    console.error("❌ Failed to create Default Admin:", error);
  }
};

createDefaultSuperAdmin();
// global error handler
app.use(globalErrorHandler);
app.use(notFound);

// export app
export default app;
