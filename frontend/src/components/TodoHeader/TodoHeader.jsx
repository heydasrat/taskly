import { useSelector } from "react-redux"
import { Plus } from "lucide-react"

const TodoHeader = ({ onAddTodo }) => {
    const todos = useSelector((state) => state.todo.todos)
    const user = useSelector((state) => state.auth.user)

    const allTodos = todos.length
    const completedTodos = todos.filter((todo) => todo.isCompleted).length
    const pendingTodos = todos.filter((todo) => !todo.isCompleted).length

    const theme = user?.preferences?.theme || "light"
    const isDark = theme === "dark"

    const headingClass = isDark
        ? "text-slate-100"
        : "text-slate-900"

    const descriptionClass = isDark
        ? "text-slate-400"
        : "text-slate-500"

    const labelClass = isDark
        ? "text-slate-400"
        : "text-slate-600"

    const countClass = isDark
        ? "text-slate-200"
        : "text-slate-900"

    return (
        <div className="w-full max-w-[47em] h-32 flex items-center justify-between">
            <div className="flex flex-col justify-center gap-2">
                <div>
                    <h1
                        className={`font-semibold text-3xl tracking-tight ${headingClass}`}
                    >
                        My Todos
                    </h1>

                    <p
                        className={`text-sm mt-1 ${descriptionClass}`}
                    >
                        Keep track of what you need to get done with clarity.
                    </p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <span className={labelClass}>
                        All:{" "}
                        <span className={`font-semibold ${countClass}`}>
                            {allTodos}
                        </span>
                    </span>

                    <span className={labelClass}>
                        Completed:{" "}
                        <span className="font-semibold text-emerald-500">
                            {completedTodos}
                        </span>
                    </span>

                    <span className={labelClass}>
                        Pending:{" "}
                        <span className="font-semibold text-amber-500">
                            {pendingTodos}
                        </span>
                    </span>
                </div>
            </div>

            <button
                type="button"
                onClick={onAddTodo}
                className="h-10 w-36 shrink-0 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-2 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200"
            >
                <Plus size={20} strokeWidth={2.5} />
                <span>Add Todo</span>
            </button>
        </div>
    )
}

export default TodoHeader

