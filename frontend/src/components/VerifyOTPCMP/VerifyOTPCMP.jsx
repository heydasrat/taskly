import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../Axios/Axios.js";
import ErrorMessage from "../Error/Error.jsx";

const VerifyOTPCMP = () => {
    const [otp, setOtp] = useState("");
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setFetching(true)


        if (!email) {
            setError("Email information is missing. Please request a new OTP.");
            return;
        }


        if (!otp.trim()) {
            setError("Please enter the OTP.");
            return;
        }


        if (!/^\d+$/.test(otp.trim())) {
            setError("OTP must contain only numbers.");
            return;
        }


        if (otp.trim().length !== 6) {
            setError("OTP must be exactly 6 digits.");
            return;
        }

        try {
            const response = await api.post("/auth/verify-otp", { otp, email })
            if (response.data.success) {
                navigate("/reset-password", { state: { resetToken: response.data.data.resetToken } })
            }
        } catch (error) {
            setError(error.response.data.message)
        } finally {
            setFetching(false)
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value;

        // Only allow numbers
        if (!/^\d*$/.test(value)) {
            return;
        }

        // Don't allow more than 6 digits
        if (value.length > 6) {
            return;
        }

        setOtp(value);
        setError("");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

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
                                    d="M9 12.75 11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Verify your email
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Enter the 6-digit code we sent to
                        </p>

                        {email && (
                            <p className="mt-1 text-sm font-medium text-gray-900 break-all">
                                {email}
                            </p>
                        )}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label
                                htmlFor="otp"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Verification code
                            </label>

                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                placeholder="Enter 6-digit code"
                                value={otp}
                                onChange={handleOtpChange}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-xl font-semibold tracking-[0.4em] text-gray-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                            {fetching ? "Verifying..." : "Verify Code"}
                        </button>
                    </form>

                    {/* Change Email */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/request-password-reset"
                            className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                        >
                            ← Change email
                        </Link>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    The verification code expires after 10 minutes.
                </p>
            </div>
        </div>
    );
};

export default VerifyOTPCMP;