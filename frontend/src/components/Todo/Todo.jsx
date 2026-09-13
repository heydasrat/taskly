import React, { useEffect, useState } from "react"

import api from "../Axios/Axios.js"

import { useDispatch, useSelector } from "react-redux"

import { addTodo } from "../../app/features/todoSlice.js"

import {
  X,
  ListPlus,
  AlertCircle,
  Loader2
} from "lucide-react"

import TodoContent from "../TodoContent/TodoContent.jsx"
import TodoHeader from "../TodoHeader/TodoHeader"

const Todo = () => {
  const [showAddTodo, setShowAddTodo] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [todoError, setTodoError] = useState("")
  const [todoLoading, setTodoLoading] = useState(false)

  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const theme = user?.preferences?.theme || "light"
  const isDark = theme === "dark"

  const pageClass = isDark
    ? "bg-[#111418] text-slate-100"
    : "bg-[#f7f8fa] text-slate-900"

  const modalClass = isDark
    ? "bg-[#181c21] border border-slate-800"
    : "bg-white border border-slate-200"

  const headingClass = isDark
    ? "text-slate-100"
    : "text-slate-900"

  const labelClass = isDark
    ? "text-slate-300"
    : "text-slate-700"

  const mutedClass = isDark
    ? "text-slate-400"
    : "text-slate-500"

  const inputClass = isDark
    ? "bg-[#20252b] border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/10"
    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/10"

  useEffect(() => {
    if (!showAddTodo) {
      setTodoError("")
    }
  }, [showAddTodo])

  const handleCreateTodo = async () => {
    if (!title.trim()) {
      setTodoError("Todo title cannot be empty.")
      return
    }

    setTodoError("")
    setTodoLoading(true)

    try {
      const response = await api.post("/todo/todos", {
        title: title.trim(),
        description: description.trim() || ""
      })

      if (response.data.success) {
        dispatch(addTodo(response.data.data))

        setTitle("")
        setDescription("")
        setTodoError("")
        setShowAddTodo(false)
      } else {
        setTodoError(
          response.data.message || "Failed to create todo."
        )
      }
    } catch (error) {
      setTodoError(
        error.response?.data?.message ||
          "Unable to create todo. Please try again."
      )
    } finally {
      setTodoLoading(false)
    }
  }

  const handleClose = () => {
    if (todoLoading) return

    setTitle("")
    setDescription("")
    setTodoError("")
    setShowAddTodo(false)
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter" && !todoLoading) {
      e.preventDefault()
      handleCreateTodo()
    }
  }

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-200 ${pageClass}`}
    >
      <div className="flex justify-center">
        <TodoHeader
          onAddTodo={() => {
            setTodoError("")
            setShowAddTodo(true)
          }}
        />

        {showAddTodo && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-colors ${
              isDark
                ? "bg-slate-950/75 backdrop-blur-md"
                : "bg-slate-900/40 backdrop-blur-md"
            }`}
          >
            <div
              className={`w-full max-w-[680px] rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors ${modalClass}`}
            >
              <div className="flex items-start justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      isDark
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    <ListPlus
                      size={21}
                      strokeWidth={2}
                    />
                  </div>

                  <div>
                    <h2
                      className={`text-xl sm:text-2xl font-semibold ${headingClass}`}
                    >
                      New Todo
                    </h2>

                    <p
                      className={`text-xs sm:text-sm mt-0.5 ${mutedClass}`}
                    >
                      Add something you want to accomplish.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={todoLoading}
                  aria-label="Close"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition disabled:opacity-50 ${
                    isDark
                      ? "text-slate-500 hover:text-slate-200 hover:bg-slate-800"
                      : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              {todoError && (
                <div
                  className={`mb-6 rounded-lg border p-3.5 text-sm flex items-start gap-3 ${
                    isDark
                      ? "bg-red-500/10 border-red-500/20 text-red-400"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />

                  <span className="font-medium">
                    {todoError}
                  </span>
                </div>
              )}

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${labelClass}`}
                >
                  Title <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setTodoError("")
                  }}
                  onKeyDown={handleTitleKeyDown}
                  placeholder="e.g. Complete today's assignment"
                  autoFocus
                  disabled={todoLoading}
                  className={`w-full h-12 px-4 rounded-lg border outline-none transition shadow-sm focus:ring-2 ${inputClass} disabled:opacity-60`}
                />
              </div>

              <div className="mt-5">
                <label
                  className={`block text-sm font-medium mb-2 ${labelClass}`}
                >
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Add some details about this todo..."
                  rows={4}
                  disabled={todoLoading}
                  className={`w-full px-4 py-3 rounded-lg border outline-none resize-none transition shadow-sm focus:ring-2 ${inputClass} disabled:opacity-60`}
                />

                <p
                  className={`mt-1.5 text-xs ${mutedClass}`}
                >
                  Add enough detail so you know exactly what
                  needs to be done.
                </p>
              </div>

              <div
                className={`mt-7 pt-5 border-t flex flex-col-reverse sm:flex-row sm:justify-end items-stretch sm:items-center gap-3 ${
                  isDark
                    ? "border-slate-800"
                    : "border-slate-100"
                }`}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={todoLoading}
                  className={`px-5 py-2.5 font-medium rounded-lg border transition disabled:opacity-50 ${
                    isDark
                      ? "text-slate-300 bg-transparent border-slate-700 hover:bg-slate-800"
                      : "text-slate-700 bg-white border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCreateTodo}
                  disabled={!title.trim() || todoLoading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition"
                >
                  {todoLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <ListPlus className="w-4 h-4" />
                      Create Todo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <TodoContent />
    </div>
  )
}

export default Todo

