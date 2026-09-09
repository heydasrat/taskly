import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ErrorMessage from "../Error/Error";
import api from "../Axios/Axios";
import { login } from "../../app/features/authSlice";

const VerifyEmailCMP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email, password } = location.state || {};

  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;

    setVerificationCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedCode = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedCode) return;

    const newCode = [...verificationCode];
    pastedCode.split("").forEach((digit, index) => {
      newCode[index] = digit;
    });

    setVerificationCode(newCode);

    const nextIndex = Math.min(pastedCode.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const code = verificationCode.join("");

    if (code.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    try {
      setFetching(true);

      const response = await api.post("/auth/verify-email", { email, otp: code });
      if (response.data.success) {
        try {
          const loginResponse = await api.post("/auth/login", { identifier: email, password });
          if (loginResponse.data.success) {
            dispatch(login(loginResponse.data.data));
            navigate("/dashboard");
          }
        } catch (error) {
          setError(error.response.data.message);
        }
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setFetching(false);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setResending(true);
      const response = await api.post("/auth/resend-otp", { email });
      if (response.data.success) {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">

        {/* Card */}
        <div className="relative overflow-hidden bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_10px_25px_-5px_rgba(0,0,0,0.05),0_20px_48px_-12px_rgba(17,24,39,0.03)] p-8">

          {/* subtle top highlight line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 shadow-sm">
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
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Verify your email
            </h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Enter the 6-digit verification code
            </p>
            {email && (
              <p className="mt-1 text-sm text-gray-900 font-medium break-all">
                {email}
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-11 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              ))}
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
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending}
              className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {resending ? "Resending..." : "Resend code"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Wrong email?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
          >
            Go back
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailCMP;