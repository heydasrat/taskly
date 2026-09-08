import { Router } from "express";
import {
    register, login, logout, getCurrentUser, verifyEmail, requestPasswordReset,
    verifyPasswordResetOtp,
    resetPassword,
    resendOTP
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }, {
        name: "coverImage",
        maxCount: 1
    }
]), register)
router.route("/verify-email").post(verifyEmail)

router.route("/login").post(login)
router.route("/logout").post(verifyJWT, logout)
router.route("/me").get(verifyJWT, getCurrentUser)
router.route("/request-password-reset").post(requestPasswordReset)
router.route("/verify-otp").post(verifyPasswordResetOtp)
router.route("/reset-password").patch(resetPassword)
router.route("/resend-otp").post(resendOTP)

export default router