import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 150,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },

        isCompleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;