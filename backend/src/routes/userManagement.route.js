import { Router } from "express";
import { changePassword, updateProfile } from "../controllers/userManagement.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/change-password").patch(verifyJWT, changePassword)
router.route("/update-profile").patch(verifyJWT, upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), updateProfile)
export default router