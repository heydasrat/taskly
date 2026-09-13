import { useState } from "react"
import { Link } from "react-router-dom"
import {
    LogOut,
    ChevronDown,
    Settings,
    User
} from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import api from "../Axios/Axios.js"
import { logout } from "../../app/features/authSlice.js"

const Navbar = () => {
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false)

    const { user } = useSelector((state) => state.auth)

    const theme = user?.preferences?.theme || "light"
    const isDark = theme === "dark"

    const handleLogout = async () => {
        try {
            await api.post(
                "/auth/logout",
                {},
                { withCredentials: true }
            )
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            dispatch(logout())
        }
    }

    const headerClass = isDark
        ? "border-slate-800/80 bg-[#111418]/90"
        : "border-slate-200/80 bg-white/90"

    const textClass = isDark
        ? "text-slate-100"
        : "text-slate-900"

    const mutedClass = isDark
        ? "text-slate-400"
        : "text-slate-500"

    const hoverClass = isDark
        ? "hover:bg-[#20252b]"
        : "hover:bg-slate-100"

    const menuClass = isDark
        ? "border-slate-800 bg-[#181c21]"
        : "border-slate-200 bg-white"

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-200 ${headerClass}`}
        >
            <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 md:px-8">
                <Link
                    to="/"
                    className="flex items-center gap-2.5"
                >
                    <img
                        src="/unnamed.png"
                        alt="Taskly"
                        className="h-9 w-9 object-contain"
                    />

                    <span
                        className={`text-xl font-semibold tracking-tight ${textClass}`}
                    >
                        Taskly
                    </span>
                </Link>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowMenu(!showMenu)}
                        className={`flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors ${hoverClass}`}
                    >
                        {user?.avatar?.url ? (
                            <img
                                src={user.avatar.url}
                                alt="Profile"
                                className={`h-9 w-9 rounded-full object-cover ring-2 ${
                                    isDark
                                        ? "ring-slate-700"
                                        : "ring-slate-100"
                                }`}
                            />
                        ) : (
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                    isDark
                                        ? "bg-[#20252b] text-slate-300"
                                        : "bg-slate-100 text-slate-600"
                                }`}
                            >
                                <User size={18} strokeWidth={2} />
                            </div>
                        )}

                        <div className="hidden text-left sm:block">
                            <p
                                className={`text-sm font-medium leading-tight ${textClass}`}
                            >
                                {user?.username ||
                                    user?.name ||
                                    "User"}
                            </p>

                            <p
                                className={`mt-0.5 max-w-[150px] truncate text-xs ${mutedClass}`}
                            >
                                {user?.email || "Account"}
                            </p>
                        </div>

                        <ChevronDown
                            size={16}
                            strokeWidth={2}
                            className={`ml-0.5 transition-transform duration-200 ${mutedClass} ${
                                showMenu ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {showMenu && (
                        <div
                            className={`absolute right-0 top-[calc(100%+10px)] w-56 overflow-hidden rounded-xl border p-1.5 shadow-xl ${menuClass}`}
                        >
                            <div
                                className={`px-3 py-2.5 mb-1 ${
                                    isDark
                                        ? "border-b border-slate-800"
                                        : "border-b border-slate-100"
                                }`}
                            >
                                <p
                                    className={`text-sm font-medium truncate ${textClass}`}
                                >
                                    {user?.fullName ||
                                        user?.username ||
                                        "User"}
                                </p>

                                <p
                                    className={`mt-0.5 text-xs truncate ${mutedClass}`}
                                >
                                    {user?.email || "Account"}
                                </p>
                            </div>

                            <Link
                                to="/setting"
                                onClick={() => setShowMenu(false)}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                    isDark
                                        ? "text-slate-300 hover:bg-[#20252b] hover:text-white"
                                        : "text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                <Settings
                                    size={17}
                                    strokeWidth={2}
                                />

                                <span>Settings</span>
                            </Link>

                            <div
                                className={`my-1 h-px ${
                                    isDark
                                        ? "bg-slate-800"
                                        : "bg-slate-100"
                                }`}
                            />

                            <button
                                onClick={handleLogout}
                                type="button"
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                    isDark
                                        ? "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                                        : "text-slate-600 hover:bg-red-50 hover:text-red-600"
                                }`}
                            >
                                <LogOut
                                    size={17}
                                    strokeWidth={2}
                                />

                                <span>Log out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar
