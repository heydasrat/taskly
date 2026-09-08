import React from "react";

const ErrorMessage = ({ message, success = false }) => {
    if (!message) return null;

    return (
        <div
            className={`px-4 py-2 rounded mb-3 text-sm border ${
                success
                    ? "bg-green-100 border-green-400 text-green-700"
                    : "bg-red-100 border-red-400 text-red-700"
            }`}
        >
            {message}
        </div>
    );
};

export default ErrorMessage;