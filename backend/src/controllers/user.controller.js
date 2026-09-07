import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import User from '../models/user.model.js'
import uploadOnCloudinary from '../utils/uploadOnCloudinary.js'

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

    if ([fullName, email, password, username].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    };

    const existedUserByEmailOrUsername = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUserByEmailOrUsername) {
        if (existedUserByEmailOrUsername.email === email) {
            throw new ApiError(409, "User already exists with this email")
        }

        if (existedUserByEmailOrUsername.username) {
            throw new ApiError(409, "Username is already taken")
        }
    }

    // const coverImageLocalPath = req.files?.coverImage[0];
    // const avatarLocalPath = req.files?.avatar[0]
    // let coverImage;
    // let avatar;




    // if (coverImageLocalPath.path) {
    //     if (coverImageLocalPath.mimetype !== 'image/jpeg') {
    //         throw new ApiError(400, "only image is required as coverImage")
    //     }

    //     coverImage = await uploadOnCloudinary(coverImageLocalPath.path)
    //     if (!coverImage) {
    //         throw new ApiError(500, "Something went wrong while uploading your image")
    //     }
    // }

    // if (avatarLocalPath.path) {
    //     if (avatarLocalPath.mimetype !== 'image/jpeg') {
    //         throw new ApiError(400, "only image is required as avatar")
    //     }
    //     avatar = await uploadOnCloudinary(avatarLocalPath.path)
    //     if (!avatar) {
    //         throw new ApiError(500, "Something went wrong while uploading your image")
    //     }
    // }

    const user = await User.create({
        username,
        fullName,
        email,
        password,
        // avatar: {
        //     url: avatar.secure_url || "",
        //     public_id: avatar.public_id || ""
        // },
        // coverImage: {
        //     url: coverImage.secure_url || "",
        //     public_id: coverImage.public_id || ""
        // }

    })

    return res.status(201).json(
        new ApiResponse(201, user, "User registered successfully")
    )


})

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
    login,
    logout,
    getCurrentUser
} 