import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Eye, EyeOff, Lock } from 'lucide-react'
import api from '../Axios/Axios.js'
import ErrorMessage from '../Error/Error.jsx'
import { login } from '../../app/features/authSlice.js'
import { useGoogleLogin } from '@react-oauth/google'


const LoginCMP = () => {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const validate = () => {
    const errors = {}
    if (!identifier.trim()) {
      errors.identifier = "Enter your username or email"
    }
    if (!password) {
      errors.password = "Enter your password"
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const googleResponse = (authResponse) => {
    try {
      console.log(authResponse)
      console.log(authResponse.code)
    } catch (error) {
      console.log(error)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: googleResponse,
    onError: googleResponse
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validate()) return

    setFetching(true)
    try {
      const response = await api.post("/auth/login", { identifier, password })
      if (response.data.success) {
        dispatch(login(response.data.data))
        const redirectTo = location.state?.from?.pathname || "/"
        navigate(redirectTo, { replace: true })
      } else {
        setError(response.data.message)
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setFetching(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <header className="w-full flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Lock size={16} />
          </div>
          <span className="font-semibold text-slate-900 tracking-tight">Taskly</span>
        </div>
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-500">All systems operational</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.04)] p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
                <Lock size={18} className="text-indigo-600" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Sign in to continue to Taskly
              </p>
            </div>

            {error && <ErrorMessage message={error} />}

            <div className="grid grid-cols-2 gap-2 mb-5 mt-2">
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
              >
                <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-5">
              <div className="w-full h-px bg-slate-200" />
              <span className="absolute px-3 bg-white text-xs uppercase tracking-wide text-slate-400">
                Or continue with
              </span>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 mb-1">
                  Username or Email
                </label>
                <input
                  id="identifier"
                  type="text"
                  autoFocus
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition bg-slate-50 focus:bg-white
                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    ${fieldErrors.identifier ? "border-red-400" : "border-slate-200"}`}
                />
                {fieldErrors.identifier && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.identifier}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Link to="/request-password-reset" className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm outline-none transition bg-slate-50 focus:bg-white
                      focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                      ${fieldErrors.password ? "border-red-400" : "border-slate-200"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={fetching}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm
                  hover:bg-indigo-700 active:bg-indigo-800 transition
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {fetching && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                  </svg>
                )}
                {fetching ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>

      <footer className="w-full py-5 px-4 md:px-6">
        <div className="max-w-sm mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Lock size={12} />
            <span>End-to-end encrypted sign-in</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/help" className="hover:text-slate-600 transition-colors">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LoginCMP