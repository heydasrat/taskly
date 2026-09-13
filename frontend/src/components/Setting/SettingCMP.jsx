
import { useEffect, useState } from "react"
import {
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  Trash,
  Sun,
  Moon,
  MessageSquare
} from "lucide-react"
import Navbar from "../NavBar/Navbar.jsx"
import api from "../Axios/Axios.js"
import { useSelector, useDispatch } from "react-redux"
import { login, updateAvatar } from "../../app/features/authSlice.js"

const SettingCMP = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)

  const [profileError, setProfileError] = useState("")
  const [profileSuccess, setProfileSuccess] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [showDeleteAvatar, setShowDeleteAvatar] = useState(false)
  const [startDeletingAvatar, setStartDeletingAvatar] = useState(false)

  const [theme, setTheme] = useState(
    user?.preferences?.theme || "light"
  )
  const [themeError, setThemeError] = useState("")

  const isDark = theme === "dark"

  const pageClass = isDark
    ? "bg-[#111418] text-slate-100"
    : "bg-[#f7f8fa] text-slate-900"

  const cardClass = isDark
    ? "bg-[#181c21] border-slate-800"
    : "bg-white border-slate-200"

  const headingClass = isDark
    ? "text-slate-100"
    : "text-slate-900"

  const mutedClass = isDark
    ? "text-slate-400"
    : "text-slate-500"

  const labelClass = isDark
    ? "text-slate-300"
    : "text-slate-700"

  const borderClass = isDark
    ? "border-slate-800"
    : "border-slate-100"

  const inputClass = isDark
    ? "bg-[#20252b] border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/10"
    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600/10"

  const secondaryButtonClass = isDark
    ? "text-slate-300 bg-[#20252b] border-slate-700 hover:bg-[#272d34]"
    : "text-slate-700 bg-white border-slate-300 hover:bg-slate-50"

  useEffect(() => {
    if (!user) return

    setUsername(user.username || "")
    setFullName(user.fullName || "")
    setTheme(user.preferences?.theme || "light")
    setShowDeleteAvatar(Boolean(user.avatar?.url))
  }, [user])

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const handleChangeTheme = async (newTheme) => {
    if (newTheme === theme) return

    const previousTheme = theme

    setTheme(newTheme)
    setThemeError("")

    try {
      const response = await api.patch(
        "/user/toggle-theme",
        { theme: newTheme },
        { withCredentials: true }
      )

      if (response.data.success) {
        dispatch(login(response.data.data))
      } else {
        setTheme(previousTheme)
        setThemeError(
          response.data.message || "Failed to change theme."
        )
      }
    } catch (error) {
      setTheme(previousTheme)
      setThemeError(
        error.response?.data?.message ||
        "Unable to change theme. Please try again."
      )
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    const isJpeg =
      file.type === "image/jpeg" ||
      file.name.toLowerCase().endsWith(".jpg") ||
      file.name.toLowerCase().endsWith(".jpeg")

    if (!isJpeg) {
      setProfileError(
        "Only JPEG images are accepted (.jpg or .jpeg)."
      )
      e.target.value = ""
      return
    }

    setAvatarFile(file)

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }

    setAvatarPreview(URL.createObjectURL(file))
    setProfileError("")
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }

    setAvatarPreview(null)

    const fileInput = document.getElementById("avatarFileInput")

    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()

    setProfileError("")
    setProfileSuccess("")

    if (!username.trim()) {
      setProfileError("Username cannot be empty.")
      return
    }

    if (!fullName.trim()) {
      setProfileError("Full name cannot be empty.")
      return
    }

    setProfileLoading(true)

    try {
      const formData = new FormData()

      formData.append("username", username.trim())
      formData.append("fullName", fullName.trim())

      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }

      const response = await api.patch(
        "/user/update-profile",
        formData,
        { withCredentials: true }
      )

      if (response.data?.success) {
        dispatch(login(response.data.data))

        setProfileSuccess("Profile updated successfully.")
        setAvatarFile(null)

        if (avatarPreview) {
          URL.revokeObjectURL(avatarPreview)
        }

        setAvatarPreview(null)

        const fileInput = document.getElementById("avatarFileInput")

        if (fileInput) {
          fileInput.value = ""
        }

        setTimeout(() => {
          setProfileSuccess("")
        }, 4000)
      } else {
        setProfileError(
          response.data?.message || "Failed to update profile."
        )
      }
    } catch (error) {
      console.error("Update profile error:", error)

      setProfileError(
        error.response?.data?.message ||
        "Failed to update profile."
      )
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    setPasswordError("")
    setPasswordSuccess("")

    if (!oldPassword) {
      setPasswordError("Please enter your current password.")
      return
    }

    if (!newPassword) {
      setPasswordError("Please enter a new password.")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "Password must be at least 8 characters long."
      )
      return
    }

    setPasswordLoading(true)

    try {
      const response = await api.patch(
        "/user/change-password",
        {
          oldPassword,
          newPassword
        },
        { withCredentials: true }
      )

      if (response.data?.success) {
        setPasswordSuccess(
          response.data?.message ||
          "Password changed successfully."
        )

        setOldPassword("")
        setNewPassword("")
        setShowOldPassword(false)
        setShowNewPassword(false)

        setTimeout(() => {
          setPasswordSuccess("")
        }, 4000)
      } else {
        setPasswordError(
          response.data?.message ||
          "Failed to change password."
        )
      }
    } catch (error) {
      setPasswordError(
        error.response?.data?.message ||
        "Failed to change password."
      )
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAvatar = async (e) => {
    e.preventDefault()

    try {
      setStartDeletingAvatar(true)

      const response = await api.patch(
        "/user/delete-avatar",
        {},
        { withCredentials: true }
      )

      if (response.data.success) {
        dispatch(updateAvatar(""))
      }
    } catch (error) {
      console.error("Delete avatar error:", error)
    } finally {
      setShowDeleteAvatar(false)
      setStartDeletingAvatar(false)
    }
  }

  const initials =
    fullName
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((name) => name[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U"

  return (
    <>
      <Navbar />

      <div
        className={`min-h-screen w-full transition-colors duration-200 ${pageClass}`}
      >
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="mb-8">
            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${headingClass}`}
            >
              Settings
            </h1>

            <p className={`text-sm mt-1 ${mutedClass}`}>
              Manage your profile and account security
            </p>
          </div>





          <div className="space-y-6">
            <section
              className={`rounded-2xl border shadow-sm p-6 sm:p-8 transition-colors ${cardClass}`}
            >
              <div
                className={`border-b pb-5 mb-6 ${borderClass}`}
              >
                <h2
                  className={`text-lg font-semibold ${headingClass}`}
                >
                  Appearance
                </h2>

                <p className={`text-sm mt-1 ${mutedClass}`}>
                  Choose how Taskly looks for you.
                </p>
              </div>

              {themeError && (
                <div className="mb-5 rounded-lg p-3.5 text-sm flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-500">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">
                    {themeError}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    value: "light",
                    title: "Light",
                    description:
                      "Use Taskly with a clean light appearance.",
                    icon: Sun
                  },
                  {
                    value: "dark",
                    title: "Dark",
                    description:
                      "Use Taskly with a comfortable dark appearance.",
                    icon: Moon
                  }
                ].map((item) => {
                  const Icon = item.icon
                  const selected = theme === item.value

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        handleChangeTheme(item.value)
                      }
                      className={`text-left rounded-xl p-5 border transition-all ${selected
                          ? isDark
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-blue-600 bg-blue-50"
                          : isDark
                            ? "border-slate-700 bg-[#20252b] hover:border-slate-600 hover:bg-[#252b32]"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-5">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-lg border shadow-sm ${isDark
                              ? "bg-[#181c21] border-slate-700"
                              : "bg-white border-slate-200"
                            }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${selected
                                ? "text-blue-500"
                                : mutedClass
                              }`}
                            strokeWidth={2}
                          />
                        </div>

                        <div
                          className={`h-5 w-5 rounded-full ${selected
                              ? "bg-white border-[5px] border-blue-600"
                              : isDark
                                ? "bg-transparent border-2 border-slate-600"
                                : "bg-white border-2 border-slate-300"
                            }`}
                        />
                      </div>

                      <h3
                        className={`text-sm font-semibold ${headingClass}`}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={`text-xs mt-1.5 ${mutedClass}`}
                      >
                        {item.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </section>

            <section
              className={`rounded-2xl border shadow-sm p-6 sm:p-8 transition-colors ${cardClass}`}
            >
              <div>
                <h2 className={`text-lg font-semibold ${headingClass}`}>
                  Help & Feedback
                </h2>

                <p className={`text-sm mt-1 ${mutedClass}`}>
                  Have a suggestion or found an issue? Let us know.
                </p>
              </div>

              <div className="mt-6">
                <a
                  href="https://forms.google.com/your-feedback-form"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  Give Feedback
                </a>
              </div>
            </section>

            <section
              className={`rounded-2xl border shadow-sm p-6 sm:p-8 transition-colors ${cardClass}`}
            >
              <div
                className={`border-b pb-5 mb-6 ${borderClass}`}
              >
                <h2
                  className={`text-lg font-semibold ${headingClass}`}
                >
                  Profile
                </h2>

                <p className={`text-sm mt-1 ${mutedClass}`}>
                  Update your personal information and profile
                  picture.
                </p>
              </div>

              {profileError && (
                <div
                  className={`mb-6 rounded-lg p-3.5 text-sm flex items-start gap-3 ${isDark
                      ? "bg-red-500/10 border border-red-500/20 text-red-400"
                      : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">
                    {profileError}
                  </span>
                </div>
              )}

              {profileSuccess && (
                <div
                  className={`mb-6 rounded-lg p-3.5 text-sm flex items-center gap-3 ${isDark
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    }`}
                >
                  <Check className="w-5 h-5" />
                  <span className="font-medium">
                    {profileSuccess}
                  </span>
                </div>
              )}



              <form onSubmit={handleProfileSubmit}>
                <div className="mb-7">
                  <label
                    className={`block text-sm font-medium mb-2 ${labelClass}`}
                  >
                    Profile photo
                  </label>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div
                      className={`w-20 h-20 rounded-full border-2 overflow-hidden flex items-center justify-center shadow-inner ${isDark
                          ? "border-slate-700 bg-[#20252b]"
                          : "border-slate-200 bg-slate-100"
                        }`}
                    >
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : user?.avatar?.url ? (
                        <img
                          src={user.avatar.url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span
                          className={`text-xl font-semibold tracking-wider ${isDark
                              ? "text-slate-300"
                              : "text-slate-700"
                            }`}
                        >
                          {initials}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <input
                          type="file"
                          id="avatarFileInput"
                          className="hidden"
                          accept="image/jpeg,image/jpg"
                          onChange={handleAvatarChange}
                        />

                        <label
                          htmlFor="avatarFileInput"
                          className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition shadow-sm cursor-pointer border ${secondaryButtonClass}`}
                        >
                          <Camera
                            className={`w-4 h-4 ${mutedClass}`}
                          />
                          Change photo
                        </label>

                        {showDeleteAvatar && (
                          <button
                            type="button"
                            onClick={handleDeleteAvatar}
                            disabled={startDeletingAvatar}
                            className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition shadow-sm border disabled:opacity-50 disabled:cursor-not-allowed ${secondaryButtonClass}`}
                          >
                            <Trash
                              className={`w-4 h-4 ${mutedClass}`}
                            />

                            {startDeletingAvatar
                              ? "Removing..."
                              : "Remove photo"}
                          </button>
                        )}

                        {avatarFile && (
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition ${isDark
                                ? "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                : "text-slate-600 hover:text-red-600 hover:bg-red-50"
                              }`}
                          >
                            Cancel selection
                          </button>
                        )}
                      </div>

                      <p className={`text-xs ${mutedClass}`}>
                        <span
                          className={`font-medium ${isDark
                              ? "text-slate-300"
                              : "text-slate-600"
                            }`}
                        >
                          JPEG images only.
                        </span>{" "}
                        Recommended square aspect ratio.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${labelClass}`}
                    >
                      Username
                    </label>

                    <input
                      type="text"
                      value={username}
                      autoComplete="username"
                      onChange={(e) =>
                        setUsername(e.target.value)
                      }
                      placeholder="e.g. johndoe"
                      className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition shadow-sm focus:ring-2 ${inputClass}`}
                    />

                    <p className={`text-xs mt-1.5 ${mutedClass}`}>
                      Your username must be unique.
                    </p>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${labelClass}`}
                    >
                      Full name
                    </label>

                    <input
                      type="text"
                      value={fullName}
                      autoComplete="name"
                      onChange={(e) =>
                        setFullName(e.target.value)
                      }
                      placeholder="e.g. John Doe"
                      className={`w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition shadow-sm focus:ring-2 ${inputClass}`}
                    />
                  </div>
                </div>

                <div
                  className={`pt-5 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4 ${borderClass}`}
                >
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>

            <section
              className={`rounded-2xl border shadow-sm p-6 sm:p-8 transition-colors ${cardClass}`}
            >
              <div
                className={`border-b pb-5 mb-6 ${borderClass}`}
              >
                <h2
                  className={`text-lg font-semibold ${headingClass}`}
                >
                  Change password
                </h2>

                <p className={`text-sm mt-1 ${mutedClass}`}>
                  Update your password to keep your account
                  secure.
                </p>
              </div>

              {passwordError && (
                <div
                  className={`mb-6 rounded-lg p-3.5 text-sm flex items-start gap-3 ${isDark
                      ? "bg-red-500/10 border border-red-500/20 text-red-400"
                      : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />

                  <span className="font-medium">
                    {passwordError}
                  </span>
                </div>
              )}

              {passwordSuccess && (
                <div
                  className={`mb-6 rounded-lg p-3.5 text-sm flex items-center gap-3 ${isDark
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    }`}
                >
                  <Check className="w-5 h-5" />

                  <span className="font-medium">
                    {passwordSuccess}
                  </span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit}>
                <div className="max-w-md space-y-5 mb-6">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${labelClass}`}
                    >
                      Current password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showOldPassword
                            ? "text"
                            : "password"
                        }
                        value={oldPassword}
                        autoComplete="current-password"
                        onChange={(e) =>
                          setOldPassword(e.target.value)
                        }
                        placeholder="••••••••"
                        className={`w-full pl-3 pr-10 py-2.5 text-sm rounded-lg border outline-none transition shadow-sm focus:ring-2 ${inputClass}`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowOldPassword(
                            !showOldPassword
                          )
                        }
                        className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDark
                            ? "text-slate-500 hover:text-slate-300"
                            : "text-slate-400 hover:text-slate-600"
                          }`}
                      >
                        {showOldPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${labelClass}`}
                    >
                      New password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        value={newPassword}
                        autoComplete="new-password"
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        placeholder="••••••••"
                        className={`w-full pl-3 pr-10 py-2.5 text-sm rounded-lg border outline-none transition shadow-sm focus:ring-2 ${inputClass}`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            !showNewPassword
                          )
                        }
                        className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDark
                            ? "text-slate-500 hover:text-slate-300"
                            : "text-slate-400 hover:text-slate-600"
                          }`}
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div
                      className={`mt-2 text-xs flex items-center gap-1.5 ${mutedClass}`}
                    >
                      <Lock className="w-3.5 h-3.5" />

                      <span>
                        Must be at least 8 characters long and
                        include numbers or symbols
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`pt-5 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4 ${borderClass}`}
                >
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Changing password...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Change password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingCMP

