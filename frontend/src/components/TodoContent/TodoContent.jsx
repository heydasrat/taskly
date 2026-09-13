import api from "../Axios/Axios"

import { useDispatch, useSelector } from "react-redux"

import {
    setLoading,
    removeTodo,
    updateTodo,
    toggleTodo
} from "../../app/features/todoSlice"

import { useState } from "react"

import { X, ListPlus, Trash2 } from "lucide-react"

import TodoCard from "../TodoCard/TodoCard"

const TodoContent = () => {
    const { todos } = useSelector((state) => state.todo)
    const { user } = useSelector((state) => state.auth)

    const dispatch = useDispatch()

    const [showEditTodo, setShowEditTodo] = useState(false)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [selectedTodo, setSelectedTodo] = useState(null)
    const [search, setSearch] = useState("")
    const [showDeleteBar, setShowDeleteBar] = useState(false)
    const [deleteTodo, setDeleteTodo] = useState(null)

    const theme = user?.preferences?.theme || "light"
    const isDark = theme === "dark"

    const containerClass = isDark
        ? "bg-[#181c21] border-slate-800"
        : "bg-[#f8f9ff] border-slate-200"

    const inputClass = isDark
        ? "bg-[#20252b] border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/10"
        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/10"

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

    const handleDelete = async (id) => {
        try {
            dispatch(setLoading(true))

            const response = await api.delete(`/todo/todos/${id}`)

            if (response.data.success) {
                dispatch(removeTodo(id))
            }
        } catch (error) {
            console.error("Delete todo error:", error)
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleToggle = async (id) => {
        try {
            dispatch(setLoading(true))

            const response = await api.patch(
                `/todo/todos/${id}/toggle`,
                {},
                {
                    withCredentials: true
                }
            )

            if (response.data.success) {
                dispatch(toggleTodo(response.data.data))
            }
        } catch (error) {
            console.error("Toggle todo error:", error)
        } finally {
            dispatch(setLoading(false))
        }
    }

    const filteredTodos = todos.filter(
        (todo) =>
            todo.title
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            todo.description
                ?.toLowerCase()
                .includes(search.toLowerCase())
    )

    const handleCloseEdit = () => {
        setSelectedTodo(null)
        setEditTitle("")
        setEditDescription("")
        setShowEditTodo(false)
    }

    const handleEdit = (todo) => {
        setSelectedTodo(todo)
        setEditTitle(todo.title)
        setEditDescription(todo.description || "")
        setShowEditTodo(true)
    }

    const handleUpdateTodo = async () => {
        if (!editTitle.trim()) return

        try {
            dispatch(setLoading(true))

            const response = await api.patch(
                `/todo/todos/${selectedTodo._id}`,
                {
                    title: editTitle.trim(),
                    description: editDescription.trim()
                }
            )

            if (response.data.success) {
                dispatch(updateTodo(response.data.data))
                handleCloseEdit()
            }
        } catch (error) {
            console.error("Update todo error:", error)
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleDeleteClick = (id) => {
        setDeleteTodo(id)
        setShowDeleteBar(true)
    }

    const handleCloseDelete = () => {
        setDeleteTodo(null)
        setShowDeleteBar(false)
    }

    const handleConfirmDelete = async () => {
        if (!deleteTodo) return

        await handleDelete(deleteTodo)

        setDeleteTodo(null)
        setShowDeleteBar(false)
    }

    return (
        <div className="w-full flex justify-center px-4 pb-10">
            <div
                className={`w-full max-w-[800px] rounded-2xl border p-4 sm:p-5 shadow-sm transition-colors duration-200 ${containerClass}`}
            >
                <div className="mb-5">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Search your todos..."
                        className={`w-full h-12 px-4 rounded-lg border outline-none shadow-sm focus:ring-2 transition ${inputClass}`}
                    />
                </div>

                <TodoCard
                    filteredTodosArray={filteredTodos}
                    onEdit={(todo) => {
                        handleEdit(todo)
                    }}
                    onDelete={(id) => {
                        handleDeleteClick(id)
                    }}
                    onToggle={(id) => {
                        handleToggle(id)
                    }}
                />

                {showEditTodo && (
                    <div
                        className={`fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-md ${
                            isDark
                                ? "bg-slate-950/75"
                                : "bg-slate-900/40"
                        }`}
                    >
                        <div
                            className={`w-full max-w-[680px] rounded-2xl shadow-2xl p-6 sm:p-8 ${modalClass}`}
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
                                        <ListPlus size={21} strokeWidth={2} />
                                    </div>

                                    <div>
                                        <h2
                                            className={`text-xl sm:text-2xl font-semibold ${headingClass}`}
                                        >
                                            Edit Todo
                                        </h2>

                                        <p
                                            className={`text-xs sm:text-sm mt-0.5 ${mutedClass}`}
                                        >
                                            Update the details of your todo.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCloseEdit}
                                    aria-label="Close"
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                                        isDark
                                            ? "text-slate-500 hover:text-slate-200 hover:bg-slate-800"
                                            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div>
                                <label
                                    className={`block text-sm font-medium mb-2 ${labelClass}`}
                                >
                                    Title <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                    placeholder="e.g. Complete today's assignment"
                                    autoFocus
                                    className={`w-full h-12 px-4 rounded-lg border outline-none shadow-sm focus:ring-2 transition ${inputClass}`}
                                />
                            </div>

                            <div className="mt-5">
                                <label
                                    className={`block text-sm font-medium mb-2 ${labelClass}`}
                                >
                                    Description
                                </label>

                                <textarea
                                    value={editDescription}
                                    onChange={(e) =>
                                        setEditDescription(e.target.value)
                                    }
                                    placeholder="Add some details about this todo..."
                                    rows={4}
                                    className={`w-full px-4 py-3 rounded-lg border outline-none resize-none shadow-sm focus:ring-2 transition ${inputClass}`}
                                />

                                <p className={`mt-1.5 text-xs ${mutedClass}`}>
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
                                    onClick={handleCloseEdit}
                                    className={`px-5 py-2.5 font-medium rounded-lg border transition ${
                                        isDark
                                            ? "text-slate-300 bg-transparent border-slate-700 hover:bg-slate-800"
                                            : "text-slate-700 bg-white border-slate-300 hover:bg-slate-50"
                                    }`}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleUpdateTodo}
                                    disabled={!editTitle.trim()}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition"
                                >
                                    Update Todo
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteBar && (
                    <div
                        className={`fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-md ${
                            isDark
                                ? "bg-slate-950/75"
                                : "bg-slate-900/40"
                        }`}
                    >
                        <div
                            className={`w-full max-w-[420px] rounded-2xl shadow-2xl p-6 ${modalClass}`}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                                        isDark
                                            ? "bg-red-500/10"
                                            : "bg-red-100"
                                    }`}
                                >
                                    <Trash2
                                        size={22}
                                        className={
                                            isDark
                                                ? "text-red-400"
                                                : "text-red-600"
                                        }
                                    />
                                </div>

                                <div>
                                    <h2
                                        className={`text-xl font-semibold ${headingClass}`}
                                    >
                                        Delete Todo?
                                    </h2>

                                    <p
                                        className={`mt-2 text-sm leading-5 ${mutedClass}`}
                                    >
                                        Are you sure you want to delete this
                                        todo? This action cannot be undone.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-7">
                                <button
                                    type="button"
                                    onClick={handleCloseDelete}
                                    className={`px-5 py-2.5 font-medium rounded-lg border transition ${
                                        isDark
                                            ? "text-slate-300 border-slate-700 hover:bg-slate-800"
                                            : "text-slate-700 border-slate-300 hover:bg-slate-50"
                                    }`}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TodoContent

