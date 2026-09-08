import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../Error/Error";
import api from "../Axios/Axios";
import { useDispatch } from "react-redux";
import { login } from "../../app/features/authSlice";

const VerifyEmailCMP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { email, password } = location.state || {};
  const dispatch = useDispatch()

  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
  ]);

  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);

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

    const pastedCode = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

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
          const response = await api.post("/auth/login", { identifier: email, password })
          if (response.data.success) {
            dispatch(login(response.data.data))
          }
        } catch (error) {
          setError(error.response.data.message)
        }
      }





    } catch (error) {
      setError(
        error?.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setFetching(false);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post("/auth/resend-otp", { email });
      if (response.data.success) {
        setError(response.data.message)
      }
    } catch (error) {
      setError(error.response.data.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-sm">

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">

          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-1">
            Verify your email
          </h1>

          <p className="text-center text-sm text-gray-500 mb-2">
            Enter the 6-digit verification code
          </p>

          {email && (
            <p className="text-center text-sm text-gray-600 mb-6">
              We sent a code to{" "}
              <span className="font-medium text-gray-900">
                {email}
              </span>
            </p>
          )}

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">

            <div
              className="flex justify-center gap-2"
              onPaste={handlePaste}
            >
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
                  onChange={(e) =>
                    handleChange(index, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-11 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={fetching}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {fetching ? "Verifying..." : "Verify Email"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Didn't receive the code?{" "}
            <button
              type="button"
              className="text-blue-600 font-medium hover:underline"
              onClick={handleResendOTP}
            >
              Resend code
            </button>
          </p>

        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          Wrong email?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 font-medium hover:underline"
          >
            Go back
          </button>
        </p>

      </div>
    </div>
  );
};

export default VerifyEmailCMP;

