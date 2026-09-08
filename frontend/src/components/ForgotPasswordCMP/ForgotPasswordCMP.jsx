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
            setError("")
            setFetching(true)
            const response = await api.post("/auth/request-password-reset", { email })
            if (response.data.success) {
                navigate("/verify-otp", {
                    state: { email }
                });
            }
        } catch (error) {
            setError(error.response.data.message)
        } finally {
            setFetching(false)
            setEmail("")
        }


    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">


                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">


                    <div className="text-center mb-8">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
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

                        <h2 className="text-2xl font-bold text-gray-900">
                            Forgot your password?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Enter the email address associated with your account
                            and we'll send you a verification code.
                        </p>
                    </div>


                    <form onSubmit={handleSubmit} className="space-y-5">


                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>

                            <input
                                required
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>


                        {error && (
                            <ErrorMessage message={error} />
                        )}


                        <button
                            type="submit"
                            disabled={fetching}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {fetching ? "Sending..." : "Send Reset Code"}
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