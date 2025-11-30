import { z } from "zod";

// Zod schema matching TAccount / authSchema
// const register_validation = z.object({
//     email: z.string({ message: "Email is required" }).email(),
//     password: z
//     .string({ message: "Password is required" })
//     .min(8, { message: "Password must be at least 8 characters long" })
//     .max(32, { message: "Password must not exceed 32 characters" })
//     .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
//     .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
//     .regex(/[0-9]/, { message: "Password must contain at least one number" })
//     .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })
// });
const register_validation = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string()
    .min(6, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include uppercase")
    .regex(/[a-z]/, "Password must include lowercase")
    .regex(/[0-9]/, "Password must include number")
    .regex(/[^A-Za-z0-9]/, "Password must include special char"),
  image: z.string().optional(),
});

const login_validation = z.object({
    email: z.string({ message: "Email is required" }),
    password: z.string({ message: "Email is required" })
})

const changePassword = z.object({
    oldPassword: z.string({ message: "Old Password is required" }),
    newPassword: z.string({ message: "New Password is required" })
})

const forgotPassword = z.object({ email: z.string({ message: "Email is required" }) })
const resetPassword = z.object({
    token: z.string(),
    newPassword: z.string(),
    email: z.string()
})
const resetPasswordValidationOtp = z.object({
    email: z.string().email({ message: "Email is required" }),
    otp: z.string({ message: "OTP is required" }),
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" })
});
const verified_account = z.object({
    token: z.string({ message: "Token is Required!!" })
})

export const auth_validation = {
    register_validation,
    login_validation,
    changePassword,
    forgotPassword,
    resetPassword,
    verified_account,
    resetPasswordValidationOtp
}