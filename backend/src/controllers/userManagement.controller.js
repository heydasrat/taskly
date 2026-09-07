import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import User from '../models/user.model.js'
import uploadOnCloudinary from '../utils/uploadOnCloudinary.js'
import { v2 as cloudinary } from 'cloudinary'

const updateProfile = asyncHandler(async (req, res) => {
    const { username, fullName } = req.body

    const user = await User.findById(req.user._id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (username !== undefined) {
        const newUsername = username.trim().toLowerCase()

        if (!newUsername) {
            throw new ApiError(400, "Username cannot be empty")
        }

        if (newUsername !== user.username) {
            const existingUser = await User.findOne({
                username: newUsername,
                _id: { $ne: user._id }
            })

            if (existingUser) {
                throw new ApiError(409, "Username is already taken")
            }

            user.username = newUsername
        }
    }

    if (fullName !== undefined) {
        const newFullName = fullName.trim()

        if (!newFullName) {
            throw new ApiError(400, "Full name cannot be empty")
        }

        user.fullName = newFullName
    }

    const avatarLocalObject = req.files?.avatar?.[0]

    let oldAvatarPublicId = null

    if (avatarLocalObject) {
        if (avatarLocalObject.mimetype !== "image/jpeg") {
            throw new ApiError(400, "Only JPEG images are allowed for avatar")
        }

        const avatar = await uploadOnCloudinary(avatarLocalObject.path)

        if (!avatar) {
            throw new ApiError(
                500,
                "Something went wrong while uploading your avatar"
            )
        }

        oldAvatarPublicId = user.avatar?.public_id

        user.avatar = {
            url: avatar.secure_url,
            public_id: avatar.public_id
        }
    }

    const updatedUser = await user.save()

    if (oldAvatarPublicId) {
        await cloudinary.uploader.destroy(oldAvatarPublicId)
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "Profile updated successfully"
        )
    )
})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || oldPassword.trim() === "") {
        throw new ApiError(400, "Invalid current password")
    }

    if (!newPassword || newPassword.trim() === "") {
        throw new ApiError(400, "Invalid new password")
    }

    const user = await User.findById(req.user._id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Incorrect current password")
    }

    user.password = newPassword

    await user.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "User password changed successfully"
        )
    )
})

export {
    changePassword,
    updateProfile
}