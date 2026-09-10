
import React, { useEffect, useState } from "react"
import {
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  Trash
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

  // Actual File sent to backend
  const [avatarFile, setAvatarFile] = useState(null)

  // Preview URL shown in UI
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
  const [startDeletingAvatar, setStartDeletingAvatar] = useState(false);



  useEffect(() => {
    if (!user) return

    setUsername(user.username || "");
    setFullName(user.fullName || "");

    if (user.avatar.url) {
      setShowDeleteAvatar(true)
    }
  }, [user])



  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    const isJpeg =
      file.type === "image/jpeg" ||
      file.name.toLowerCase().endsWith(".jpg") ||
      file.name.toLowerCase().endsWith(".jpeg")

    if (!isJpeg) {
      setProfileError("Only JPEG images are accepted (.jpg or .jpeg).")
      e.target.value = ""
      return
    }

    // Store actual file
    setAvatarFile(file)

    // Create preview
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)

    setProfileError("")
  }



  const handleRemoveAvatar = () => {
    setAvatarFile(null)
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

    // Validation
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
        {
          withCredentials: true,
        }
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

      setProfileError(error.response.data.message)
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
          newPassword,
        },
        {
          withCredentials: true,
        }
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

      console.log(error.response.data.message);
      setPasswordError(
        error.response.data.message
      )
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAvatar = async (e) => {
    e.preventDefault()
    try {
      setStartDeletingAvatar(true)
      const response = await api.patch("/user/delete-avatar", {}, { withCredentials: true })
      if (response.data.success) {
        dispatch(updateAvatar(""))
      }
    } catch (error) {

    } finally {
      setShowDeleteAvatar(false)
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

      <div className="bg-[#f9fafb] min-h-screen w-full">

        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {/* Settings Header */}

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Settings
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your profile and account security
            </p>
          </div>


          <div className="space-y-6">

            {/* =====================================
                PROFILE
            ===================================== */}

            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">

              {/* Header */}

              <div className="border-b border-gray-100 pb-5 mb-6">

                <h2 className="text-lg font-semibold text-gray-900">
                  Profile
                </h2>

                <p className="text-sm text-gray-500 mt-0.5">
                  Update your personal information and profile picture.
                </p>

              </div>


              {/* Error */}

              {profileError && (
                <div className="mb-6 rounded-lg p-3.5 text-sm flex items-start gap-3 bg-red-50 border border-red-200 text-red-700">

                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />

                  <span className="font-medium">
                    {profileError}
                  </span>

                </div>
              )}


              {/* Success */}

              {profileSuccess && (
                <div className="mb-6 rounded-lg p-3.5 text-sm flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700">

                  <Check className="w-5 h-5" />

                  <span className="font-medium">
                    {profileSuccess}
                  </span>

                </div>
              )}


              <form onSubmit={handleProfileSubmit}>

                {/* Avatar */}

                <div className="mb-6">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile photo
                  </label>


                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

                    {/* Avatar */}

                    <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">

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

                        <span className="text-xl font-semibold tracking-wider text-gray-700">
                          {initials}
                        </span>

                      )}

                    </div>


                    {/* Avatar actions */}

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
                          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm cursor-pointer"
                        >

                          <Camera className="w-4 h-4 text-gray-500" />

                          Change photo

                        </label>
                        {showDeleteAvatar ? <label
                          onClick={handleDeleteAvatar}
                          disabled={startDeletingAvatar}
                          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm cursor-pointer"
                        >

                          <Trash className="w-4 h-4 text-gray-500" />

                          Remove photo

                        </label> : null}


                        {avatarFile && (

                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            Cancel selection
                          </button>

                        )}

                      </div>


                      <p className="text-xs text-gray-500">

                        <span className="font-medium text-gray-600">
                          JPEG images only.
                        </span>{" "}

                        Recommended square aspect ratio.

                      </p>

                    </div>

                  </div>

                </div>


                {/* Profile fields */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">

                  {/* Username */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Username
                    </label>

                    <input
                      type="text"
                      value={username}
                      autoComplete="username"
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. johndoe"
                      className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition shadow-sm"
                    />

                    <p className="text-xs text-gray-500 mt-1.5">
                      Your username must be unique.
                    </p>

                  </div>


                  {/* Full name */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full name
                    </label>

                    <input
                      type="text"
                      value={fullName}
                      autoComplete="name"
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition shadow-sm"
                    />

                  </div>

                </div>


                {/* Profile actions */}

                <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">

                  <div />

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
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


            {/* =====================================
                CHANGE PASSWORD
            ===================================== */}

            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">

              {/* Header */}

              <div className="border-b border-gray-100 pb-5 mb-6">

                <h2 className="text-lg font-semibold text-gray-900">
                  Change password
                </h2>

                <p className="text-sm text-gray-500 mt-0.5">
                  Update your password to keep your account secure.
                </p>

              </div>


              {/* Error */}

              {passwordError && (

                <div className="mb-6 rounded-lg p-3.5 text-sm flex items-start gap-3 bg-red-50 border border-red-200 text-red-700">

                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />

                  <span className="font-medium">
                    {passwordError}
                  </span>

                </div>

              )}


              {/* Success */}

              {passwordSuccess && (

                <div className="mb-6 rounded-lg p-3.5 text-sm flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700">

                  <Check className="w-5 h-5" />

                  <span className="font-medium">
                    {passwordSuccess}
                  </span>

                </div>

              )}


              <form onSubmit={handlePasswordSubmit}>

                <div className="max-w-md space-y-5 mb-6">

                  {/* Current password */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Current password
                    </label>


                    <div className="relative">

                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        autoComplete="current-password"
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-3 pr-10 py-2.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition shadow-sm"
                      />


                      <button
                        type="button"
                        onClick={() =>
                          setShowOldPassword(!showOldPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >

                        {showOldPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}

                      </button>

                    </div>

                  </div>


                  {/* New password */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      New password
                    </label>


                    <div className="relative">

                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        autoComplete="new-password"
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        placeholder="••••••••"
                        className="w-full pl-3 pr-10 py-2.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition shadow-sm"
                      />


                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(!showNewPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >

                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}

                      </button>

                    </div>


                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">

                      <Lock className="w-3.5 h-3.5 text-gray-400" />

                      <span>
                        Must be at least 8 characters long and include numbers or symbols
                      </span>

                    </div>

                  </div>

                </div>


                {/* Password actions */}

                <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">

                  <div />

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
