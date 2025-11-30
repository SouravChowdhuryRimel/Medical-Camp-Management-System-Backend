import { Router } from "express";
import { auth_controllers } from "./auth.controller";
import RequestValidator from "../../middlewares/request_validator";
import { auth_validation } from "./auth.validation";
import auth from "../../middlewares/auth";
import { auth_services } from "./auth.service";
import { uploadSingle } from "../../utils/cloudinary";

const authRoute = Router();

authRoute.post(
  "/register",uploadSingle,
  RequestValidator(auth_validation.register_validation),
  auth_controllers.register_user
);
authRoute.post(
  "/login",
  RequestValidator(auth_validation.login_validation),
  auth_controllers.login_user
);

authRoute.get(
  "/me",
  auth("ADMIN", "USER", "VOLUNTEER", "CLINICIAN", "SuperAdmin"),
  auth_controllers.get_my_profile
);

authRoute.post("/refresh-token", auth_controllers.refresh_token);
authRoute.put(
  "/change-password",
  auth("ADMIN", "USER", "VOLUNTEER", "CLINICIAN", "SuperAdmin"),
  RequestValidator(auth_validation.changePassword),
  auth_controllers.change_password
);
authRoute.post(
  "/forgot-password",
  RequestValidator(auth_validation.forgotPassword),
  auth_controllers.forget_password
);
authRoute.post(
  "/reset-password",
  RequestValidator(auth_validation.resetPassword),
  auth_controllers.reset_password
);

authRoute.post(
  "/reset-password-otp",
  RequestValidator(auth_validation.resetPasswordValidationOtp),
  auth_controllers.reset_password_otp
);

authRoute.post(
  "/verified-account",
  RequestValidator(auth_validation.verified_account),
  auth_controllers.verified_account
);
authRoute.post("/verify-otp", auth_controllers.verifyOTP);
authRoute.post(
  "/new-verification-link",
  RequestValidator(auth_validation.forgotPassword),
  auth_controllers.get_new_verification_link
);

authRoute.delete(
  "/delete-account",
  auth_controllers.delete_account
);
export default authRoute;
