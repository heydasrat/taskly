import React from "react"

import { Check, Pencil, Trash2 } from "lucide-react"

import { useSelector } from "react-redux"

const TodoCard = ({
    filteredTodosArray,
    onEdit,
    onDelete,
    onToggle
}) => {
    const { todos, isLoading } = useSelector((state) => state.todo)
    const { user } = useSelector((state) => state.auth)

    const filteredTodosArr = filteredTodosArray ?? todos

    const theme = user?.preferences?.theme || "light"
    const isDark = theme === "dark"

    if (isLoading) {
        return (
            <div className="w-full space-y-3">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className={`h-28 rounded-xl border animate-pulse ${
                            isDark
                                ? "border-slate-800 bg-[#20252b]"
                                : "border-slate-200 bg-white"
                        }`}
                    />
                ))}
            </div>
        )
    }

    if (!todos || todos.length === 0) {
        return (
            <div className="w-full py-16 text-center">
                <div
                    className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        isDark
                            ? "bg-indigo-500/10"
                            : "bg-indigo-50"
                    }`}
                >
                    <Check
                        size={22}
                        className={
                            isDark
                                ? "text-indigo-400"
                                : "text-indigo-600"
                        }
                    />
                </div>

                <h3
                    className={`text-lg font-semibold ${
                        isDark
                            ? "text-slate-100"
                            : "text-slate-900"
                    }`}
                >
                    No todos yet
                </h3>

                <p
                    className={`mt-1 text-sm ${
                        isDark
                            ? "text-slate-400"
                            : "text-slate-500"
                    }`}
                >
                    Create your first todo to get started.
                </p>
            </div>
        )
    }

    if (filteredTodosArr.length === 0) {
        return (
            <div className="w-full py-16 text-center">
                <h3
                    className={`text-lg font-semibold ${
                        isDark
                            ? "text-slate-100"
                            : "text-slate-900"
                    }`}
                >
                    No todos found
                </h3>

                <p
                    className={`mt-1 text-sm ${
                        isDark
                            ? "text-slate-400"
                            : "text-slate-500"
                    }`}
                >
                    Try searching with a different title.
                </p>
            </div>
        )
    }

    return (
        <div className="w-full space-y-3">
            {filteredTodosArr.map((todo) => (
                <div
                    key={todo._id}
                    className={`group w-full border rounded-xl px-5 py-4 flex items-center gap-4 transition-all duration-200 hover:shadow-md ${
                        isDark
                            ? todo.isCompleted
                                ? "border-slate-800 bg-[#15191d]"
                                : "border-slate-800 bg-[#20252b] hover:border-indigo-500/40"
                            : todo.isCompleted
                                ? "border-slate-200 bg-slate-50/70"
                                : "border-slate-200 bg-white hover:border-indigo-200"
                    }`}
                >
                    <button
                        type="button"
                        onClick={() => onToggle?.(todo._id)}
                        aria-label={
                            todo.isCompleted
                                ? "Mark todo as incomplete"
                                : "Mark todo as complete"
                        }
                        className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            todo.isCompleted
                                ? "bg-indigo-600 border-indigo-600"
                                : isDark
                                    ? "border-slate-600 hover:border-indigo-400"
                                    : "border-slate-300 hover:border-indigo-500"
                        }`}
                    >
                        {todo.isCompleted && (
                            <Check
                                size={14}
                                strokeWidth={3}
                                className="text-white"
                            />
                        )}
                    </button>

                    <div className="min-w-0 flex-1">
                        <h3
                            className={`text-[15px] font-semibold truncate ${
                                todo.isCompleted
                                    ? isDark
                                        ? "text-slate-500 line-through"
                                        : "text-slate-400 line-through"
                                    : isDark
                                        ? "text-slate-100"
                                        : "text-slate-900"
                            }`}
                        >
                            {todo.title}
                        </h3>

                        {todo.description && (
                            <p
                                className={`mt-1 text-sm line-clamp-2 ${
                                    todo.isCompleted
                                        ? isDark
                                            ? "text-slate-600"
                                            : "text-slate-400"
                                        : isDark
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                }`}
                            >
                                {todo.description}
                            </p>
                        )}
                    </div>

                    <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            type="button"
                            onClick={() => onEdit?.(todo)}
                            aria-label="Edit todo"
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${
                                isDark
                                    ? "text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                                    : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                            }`}
                        >
                            <Pencil size={17} />
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete?.(todo._id)}
                            aria-label="Delete todo"
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${
                                isDark
                                    ? "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                    : "text-slate-500 hover:text-red-600 hover:bg-red-50"
                            }`}
                        >
                            <Trash2 size={17} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TodoCard

