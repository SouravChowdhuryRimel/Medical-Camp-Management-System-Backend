import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/app_error';
import { configs } from '../configs';
import { jwtHelpers, JwtPayloadType } from '../utils/JWT';
import { Account_Model } from '../modules/auth/auth.schema';


type Role = "ADMIN" | "USER" | "VOLUNTEER" | "CLINICIAN" | "SuperAdmin";


const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new AppError('You are not authorize!!', 401);
            }
            const verifiedUser = jwtHelpers.verifyToken(
                token,
                configs.jwt.access_token as string,
            );
            if (!roles.length || !roles.includes(verifiedUser.role)) {
                throw new AppError('You are not authorize!!', 401);
            }
            // check user
            const isUserExist = await Account_Model.findOne({ email: verifiedUser?.email }).lean()
            if (!isUserExist) {
                throw new AppError("Account not found !", 404)
            }
            if (isUserExist?.accountStatus == "SUSPENDED") {
                throw new AppError("This Account is blocked !", 401)
            }
            if (isUserExist?.isDeleted) {
                throw new AppError("This account is deleted", 401)
            }
            if (!isUserExist?.isVerified) {
                throw new AppError("This account is not verified ", 401)
            }
            req.user = verifiedUser as JwtPayloadType;
            next();
        } catch (err) {
            next(err);
        }
    };
};

export default auth;