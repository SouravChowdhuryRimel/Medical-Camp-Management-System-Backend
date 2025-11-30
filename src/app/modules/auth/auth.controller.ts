import { configs } from "../../configs";
import catchAsync from "../../utils/catch_async";
import { uploadImgToCloudinary } from "../../utils/cloudinary";
import manageResponse from "../../utils/manage_response";
import { auth_services } from "./auth.service";
import httpStatus from 'http-status';

// const register_user = catchAsync(async (req, res) => {
//     const result = await auth_services.register_user_into_db(req?.body)
//     manageResponse(res, {
//         success: true,
//         message: "Account created successful",
//         statusCode: httpStatus.OK,
//         data: result
//     })
// })

const register_user = catchAsync(async (req, res) => {
  const payload = req.body;

  // If image included
  if (req.file) {
    const imageName = `user-${Date.now()}`;
    const uploaded = await uploadImgToCloudinary(
      imageName,
      req.file.path,
      "users"
    );

    payload.image = uploaded.secure_url;
  }

  const result = await auth_services.register_user_into_db(payload);

  manageResponse(res, {
    success: true,
    message: "Account created successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

const login_user = catchAsync(async (req, res) => {
    const result = await auth_services.login_user_from_db(req.body);

    res.cookie('refreshToken', result.refreshToken, {
        secure: configs.env == 'production',
        httpOnly: true,
    });
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in successful !',
        data: {
            accessToken: result.accessToken,
            role: result?.role
        },
    });
});

const get_my_profile = catchAsync(async (req, res) => {
    const { email } = req.user!;
    const result = await auth_services.get_my_profile_from_db(email);
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User profile fetched successfully!',
        data: result,
    });
});

const refresh_token = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await auth_services.refresh_token_from_db(refreshToken);
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Refresh token generated successfully!',
        data: {
            accessToken: result,
        },
    });
});

const change_password = catchAsync(async (req, res) => {
    const user = req?.user;
    const result = await auth_services.change_password_from_db(user!, req.body);

    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password changed successfully!',
        data: result,
    });
});

const forget_password = catchAsync(async (req, res) => {
    const { email } = req?.body
    await auth_services.forget_password_from_db(email);
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reset password link sent to your email!',
        data: null,
    });
});

const reset_password = catchAsync(async (req, res) => {
    const { token, newPassword, email } = req.body;
    const result = await auth_services.reset_password_into_db(
        token,
        email,
        newPassword,
    );
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password reset successfully!',
        data: result,
    });
});

const reset_password_otp = catchAsync(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    // Optional: Basic check
    if (!email || !otp || !newPassword) {
        return manageResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Email, OTP, and new password are required."
        });
    }

    const message = await auth_services.reset_password_into_db_otp(email, otp, newPassword);

    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message
    });
});

// const verified_account = catchAsync(async (req, res) => {
//     const result = await auth_services.verified_account_into_db(req?.body?.token)

//     manageResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Account Verification successful.",
//         data: result
//     })
// })

const verified_account = catchAsync(async (req, res, next) => {
  const { token, code } = req.body;

  // Call service
  const result = await auth_services.verified_account_into_db(token, code);

  // Send response
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account verification successful.",
    data: result,
  });
});

const get_new_verification_link = catchAsync(async (req, res) => {
    const result = await auth_services.get_new_verification_link_from_db(req?.body?.email)
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "New Verification link is send on email.",
        data: result
    })
})

const delete_account = catchAsync(async (req, res) => {
  const result = await auth_services.delete_account_from_db(req.body.email);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Account deleted successfully.",
    data: result,
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const result = await auth_services.verify_otp_service(email, otp);

  manageResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verification successful",
    data: result,
  });
});

export const auth_controllers = {
    register_user,
    login_user,
    get_my_profile,
    refresh_token,
    change_password,
    reset_password,
    forget_password,
    verified_account,
    get_new_verification_link,
    reset_password_otp,
    delete_account,
    verifyOTP,
}