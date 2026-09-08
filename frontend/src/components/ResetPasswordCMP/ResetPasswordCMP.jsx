import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../Axios/Axios.js";
import ErrorMessage from "../Error/Error.jsx";

const ResetPasswordCMP = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const resetToken = location.state?.resetToken;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        
        if (!resetToken) {
            setError(
                "Password reset session is invalid. Please request a new reset code."
            );
            return;
        }


        if (!newPassword.trim()) {
            setError("Please enter a new password.");
            return;
        }


        if (!confirmPassword.trim()) {
            setError("Please confirm your new password.");
            return;
        }


        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }


        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        try {
            const response = await api.patch("/auth/reset-password", { resetToken, newPassword, confirmPassword })
            if (response.data.success) {
                navigate("/login")
            }
        } catch (error) {
            console.log(error.response)
            setError(error.response.data.message)
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-7 w-7 text-indigo-600"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 0h10.5A1.75 1.75 0 0 1 19 12.25v7A1.75 1.75 0 0 1 17.25 21h-10.5A1.75 1.75 0 0 1 5 19.25v-7a1.75 1.75 0 0 1 1.75-1.75Z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Create a new password
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Choose a strong password for your account.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* New Password */}
                        <div>
                            <label
                                htmlFor="newPassword"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                New password
                            </label>

                            <input
                                id="newPassword"
                                type="password"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setError("");
                                }}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                            <p className="mt-2 text-xs text-gray-400">
                                Password must be at least 8 characters.
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Confirm password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError("");
                                }}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <ErrorMessage message={error} />
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={fetching}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {fetching ? "Updating..." : "Reset Password"}
                        </button>
                    </form>

                    {/* Login */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-400">
                    Make sure you remember your new password.
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordCMP;