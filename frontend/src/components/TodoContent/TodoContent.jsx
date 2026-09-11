import api from '../Axios/Axios'
import { useDispatch, useSelector } from 'react-redux'
import {
    setLoading,
    removeTodo,
    updateTodo,
    toggleTodo
} from '../../app/features/todoSlice'
import { useState } from 'react'
import { X, ListPlus, Trash2 } from 'lucide-react'
import TodoCard from '../TodoCard/TodoCard'

const TodoContent = () => {

    const { todos } = useSelector((state) => state.todo)

    const dispatch = useDispatch()

    const [showEditTodo, setShowEditTodo] = useState(false)
    const [editTitle, setEditTitle] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [selectedTodo, setSelectedTodo] = useState(null)

    const [search, setSearch] = useState('')

    const [showDeleteBar, setShowDeleteBar] = useState(false)
    const [deleteTodo, setDeleteTodo] = useState(null)

    const handleDelete = async (id) => {

        try {

            dispatch(setLoading(true))

            const response = await api.delete(
                `/todo/todos/${id}`
            )

            if (response.data.success) {
                dispatch(removeTodo(id))
            }

        } catch (error) {

            console.error('Delete todo error:', error)

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

            console.error('Toggle todo error:', error)

        } finally {

            dispatch(setLoading(false))

        }
    }

    const filteredTodos = todos.filter((todo) =>
        todo.title
            .toLowerCase()
            .includes(search.toLowerCase()) ||
        todo.description
            ?.toLowerCase()
            .includes(search.toLowerCase())
    )

    const handleCloseEdit = () => {

        setSelectedTodo(null)
        setEditTitle('')
        setEditDescription('')
        setShowEditTodo(false)

    }

    const handleEdit = (todo) => {

        setSelectedTodo(todo)
        setEditTitle(todo.title)
        setEditDescription(todo.description || '')
        setShowEditTodo(true)

    }

    const handleUpdateTodo = async () => {

        if (!editTitle.trim()) return

        try {

            dispatch(setLoading(true))

            const response = await api.patch(
                `/todo/todos/${selectedTodo._id}`,
                {
                    title: editTitle,
                    description: editDescription
                }
            )

            if (response.data.success) {

                dispatch(updateTodo(response.data.data))

                handleCloseEdit()

            }

        } catch (error) {

            console.error('Update todo error:', error)

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

        <div className="w-full flex justify-center">

            <div className="w-[50em] bg-[#f8f9ff] rounded-2xl p-4">

                <div className="mb-5">

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Search your todos..."
                        className="
                            w-full
                            h-12
                            px-4
                            rounded-lg
                            border
                            border-gray-200
                            bg-white
                            outline-none
                            focus:border-indigo-500
                            focus:ring-2
                            focus:ring-indigo-100
                            transition
                        "
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

                    <div className="
                        fixed
                        inset-0
                        bg-slate-900/40
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        z-50
                    ">

                        <div className="
                            w-full
                            max-w-[720px]
                            bg-white
                            rounded-2xl
                            shadow-2xl
                            p-8
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                                mb-7
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                ">

                                    <ListPlus
                                        size={25}
                                        strokeWidth={2.2}
                                        className="text-indigo-600"
                                    />

                                    <h2 className="
                                        text-2xl
                                        font-semibold
                                        text-gray-900
                                    ">
                                        Edit Todo
                                    </h2>

                                </div>

                                <button
                                    type="button"
                                    onClick={handleCloseEdit}
                                    className="
                                        text-gray-500
                                        hover:text-gray-800
                                        transition
                                    "
                                >
                                    <X size={25} />
                                </button>

                            </div>

                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-900
                                    mb-2
                                ">
                                    Title
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                    placeholder="e.g., Complete today's assignment"
                                    autoFocus
                                    className="
                                        w-full
                                        h-12
                                        px-4
                                        rounded-lg
                                        border
                                        border-gray-200
                                        outline-none
                                        focus:border-indigo-500
                                        focus:ring-2
                                        focus:ring-indigo-100
                                        transition
                                    "
                                />

                            </div>

                            <div className="mt-5">

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-900
                                    mb-2
                                ">
                                    Description
                                </label>

                                <textarea
                                    value={editDescription}
                                    onChange={(e) =>
                                        setEditDescription(e.target.value)
                                    }
                                    placeholder="Add some details about this todo..."
                                    rows={4}
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-lg
                                        border
                                        border-gray-200
                                        outline-none
                                        resize-none
                                        focus:border-indigo-500
                                        focus:ring-2
                                        focus:ring-indigo-100
                                        transition
                                    "
                                />

                            </div>

                            <div className="
                                flex
                                justify-end
                                items-center
                                gap-3
                                mt-8
                            ">

                                <button
                                    type="button"
                                    onClick={handleCloseEdit}
                                    className="
                                        px-5
                                        py-2.5
                                        text-gray-700
                                        font-medium
                                        hover:bg-gray-100
                                        rounded-lg
                                        transition
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleUpdateTodo}
                                    disabled={!editTitle.trim()}
                                    className="
                                        px-5
                                        py-2.5
                                        bg-indigo-600
                                        hover:bg-indigo-700
                                        disabled:bg-indigo-300
                                        disabled:cursor-not-allowed
                                        text-white
                                        font-semibold
                                        rounded-lg
                                        transition
                                    "
                                >
                                    Update Todo
                                </button>

                            </div>

                        </div>

                    </div>

                )}

                {showDeleteBar && (

                    <div className="
                        fixed
                        inset-0
                        bg-slate-900/40
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        z-50
                        px-4
                    ">

                        <div className="
                            w-full
                            max-w-[420px]
                            bg-white
                            rounded-2xl
                            shadow-2xl
                            p-6
                        ">

                            <div className="
                                flex
                                items-start
                                gap-4
                            ">

                                <div className="
                                    w-11
                                    h-11
                                    rounded-full
                                    bg-red-100
                                    flex
                                    items-center
                                    justify-center
                                    shrink-0
                                ">

                                    <Trash2
                                        size={22}
                                        className="text-red-600"
                                    />

                                </div>

                                <div>

                                    <h2 className="
                                        text-xl
                                        font-semibold
                                        text-gray-900
                                    ">
                                        Delete Todo?
                                    </h2>

                                    <p className="
                                        text-gray-500
                                        mt-2
                                        text-sm
                                        leading-5
                                    ">
                                        Are you sure you want to delete
                                        this todo? This action cannot be
                                        undone.
                                    </p>

                                </div>

                            </div>

                            <div className="
                                flex
                                justify-end
                                gap-3
                                mt-7
                            ">

                                <button
                                    type="button"
                                    onClick={handleCloseDelete}
                                    className="
                                        px-5
                                        py-2.5
                                        text-gray-700
                                        font-medium
                                        hover:bg-gray-100
                                        rounded-lg
                                        transition
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="
                                        px-5
                                        py-2.5
                                        bg-red-600
                                        hover:bg-red-700
                                        text-white
                                        font-semibold
                                        rounded-lg
                                        transition
                                    "
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

