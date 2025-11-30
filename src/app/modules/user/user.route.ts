import { NextFunction, Request, Response, Router } from "express";
import { user_controllers } from "./user.controller";
import uploader from "../../middlewares/uploader";
import { user_validations } from "./user.validation";
import auth from "../../middlewares/auth";

const userRoute = Router()

userRoute.patch(
    "/update-profile",
    // auth("ADMIN","USER", "VOLUNTEER", "CLINICIAN"),
    uploader.single("image"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = user_validations.update_user.parse(JSON.parse(req?.body?.data))
        user_controllers.update_profile(req, res, next)
    },
)

// userRoute.post("/create", user_controllers.createUser);
// userRoute.get("/get-all", user_controllers.getAllUsers);
userRoute.get("/get-single/:userId", user_controllers.getUserById);


export default userRoute;