import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../Axios/Axios.js";
import ErrorMessage from "../Error/Error.jsx";

const ForgotPasswordCMP = () => {
    const [email, setEmail] = useState("");
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setFetching(true);
            const response = await api.post("/auth/request-password-reset", { email });
            if (response.data.success) {
                navigate("/verify-otp", { state: { email } });
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setFetching(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-[420px]">

                {/* Card */}
                <div className="relative overflow-hidden bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_10px_25px_-5px_rgba(0,0,0,0.05),0_20px_48px_-12px_rgba(17,24,39,0.03)] p-8">

                    {/* subtle top highlight line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />

                    {/* Header */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm mb-4">
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

                        <h2 className="text-2xl font-bold text-gray-900 text-center">
                            Forgot your password?
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 text-center leading-relaxed px-1">
                            Enter the email address associated with your account and we'll send you a verification code.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <span className="text-xs text-gray-400">Required</span>
                            </div>

                            <div className="relative flex items-center">
                                <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                </span>

                                <input
                                    required
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-11 pl-11 pr-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>

                        {error && <ErrorMessage message={error} />}

                        <button
                            type="submit"
                            disabled={fetching}
                            className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {fetching ? (
                                <>
                                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Code"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    Your account security is important to us.
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordCMP;