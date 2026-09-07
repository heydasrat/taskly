import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, ChevronDown, Settings, User } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import api from '../Axios/Axios.js'
import { logout } from '../../app/features/authSlice.js'

const Navbar = () => {
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false)

    const { user } = useSelector((state) => state.auth)

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

    return (
        <header className=" top-0 z-50 w-full border-b border-gray-200/70 bg-white/80 backdrop-blur-xl">

            <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 md:px-8">


                <Link to="/" className="flex items-center gap-3">
                    <img
                        src="/unnamed.png"
                        alt="TaskFlow"
                        className="h-10 w-10 object-contain"
                    />
                    <span className="text-xl font-semibold tracking-tight text-gray-900">
                        TaskFlow
                    </span>
                </Link>



                <div className="relative">


                    <button
                        type="button"
                        onClick={() => setShowMenu(!showMenu)}
                        className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-gray-100"
                    >
                        {user.avatar.url ?
                            <img
                                src={user?.avatar.url}
                                alt="Profile"
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100"
                            />
                            :
                            <User />}


                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-medium leading-tight text-gray-900">
                                {user?.username || user?.name || "User"}
                            </p>

                            <p className="mt-0.5 max-w-[150px] truncate text-xs text-gray-500">
                                {user?.email || "Account"}
                            </p>
                        </div>


                        <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform duration-200 ${showMenu ? "rotate-180" : ""
                                }`}
                        />
                    </button>



                    {showMenu && (
                        <div className="absolute right-0 top-[calc(100%+10px)] w-52 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">


                            <Link
                                to="/setting"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                            >
                                <Settings size={17} strokeWidth={2} />
                                Setting
                            </Link>



                            <div className="my-1 h-px bg-gray-100" />



                            <button
                                onClick={handleLogout}
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                                <LogOut size={17} strokeWidth={2} />

                                <span>
                                    Log out
                                </span>
                            </button>

                        </div>
                    )}

                </div>

            </div>
        </header>
    )
}

export default Navbar

