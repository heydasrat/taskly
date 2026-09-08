import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const PasswordReset = mongoose.model(
    "PasswordReset",
    PasswordResetSchema
);

export default PasswordReset;