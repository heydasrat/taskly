import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import User from '../models/user.model.js'
import uploadOnCloudinary from '../utils/uploadOnCloudinary.js'
import { sendEmail } from '../service/email.service.js'
import { OTPHTML, generateOTP } from '../utils/otp.utils.js'
import OTP from '../models/otp.model.js'

const options = {
    secure: true,
    httpOnly: true
}


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating your tokens")
    }
}

const register = asyncHandler(async (req, res) => {
    const { fullName, email, password, username } = req.body;

    if (
        [fullName, email, password, username]
            .some((field) => !field || field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existedUserByEmailOrUsername = await User.findOne({
        $or: [
            { email: normalizedEmail },
            { username }
        ]
    });

    if (existedUserByEmailOrUsername) {
        if (existedUserByEmailOrUsername.email === normalizedEmail) {
            throw new ApiError(
                409,
                "User already exists with this email"
            );
        }

        if (existedUserByEmailOrUsername.username === username) {
            throw new ApiError(
                409,
                "Username is already taken"
            );
        }
    }

    const user = await User.create({
        username,
        fullName,
        email: normalizedEmail,
        password
    });

    // Remove any previous OTP for this email
    await OTP.deleteMany({
        email: normalizedEmail
    });

    const otp = generateOTP();

    await OTP.create({
        email: normalizedEmail,
        otp: otp.toString(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await sendEmail(
        normalizedEmail,
        "Verify Your Email — Taskly",
        `Your Taskly verification code is ${otp}. This code will expire in 10 minutes.`,
        OTPHTML(otp)
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            user,
            "User registered successfully. Please verify your email address."
        )
    );
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || email.trim() === "") {
        throw new ApiError(400, "Email is missing");
    }

    if (!otp || otp.trim() === "") {
        throw new ApiError(400, "OTP is missing");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const OTPDoc = await OTP.findOne({
        email: normalizedEmail,
        otp: otp.trim()
    });

    if (!OTPDoc) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (OTPDoc.expiresAt < new Date()) {
        await OTP.deleteOne({ _id: OTPDoc._id });

        throw new ApiError(400, "OTP has expired");
    }

    const user = await User.findOneAndUpdate(
        { email: normalizedEmail },
        {
            $set: {
                isVerified: true
            }
        },
        {
            new: true
        }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await OTP.deleteMany({
        email: normalizedEmail
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Email verified successfully"
        )
    );
});

const login = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body

    if (!identifier || identifier.trim() === "") {
        throw new ApiError(400, "Username or email is required")
    }

    if (!password || password.trim() === "") {
        throw new ApiError(400, "Password is required")
    }

    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    })

    if (!user) {
        throw new ApiError(404, "User not found!")
    }

    if (!user.isVerified) {
        return res.status(403).json(
            new ApiResponse(403, {}, "Please verify your email before logging in.")
        )
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-refreshToken -password")

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                loggedInUser,
                "User logged in successfully"
            )
        );

})

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: null
        }
    }, {
        new: true
    })

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        )

})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    return res.status(200).json(
        new ApiResponse(200, user, "Current user fetched successfully")
    )
})

export {
    register,
    verifyEmail,
    login,
    logout,
    getCurrentUser
} 