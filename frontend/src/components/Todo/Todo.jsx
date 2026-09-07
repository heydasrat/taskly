import React, { useState } from 'react'
import api from '../Axios/Axios.js'
import { useDispatch } from 'react-redux'
import { addTodo } from '../../app/features/todoSlice.js'

import { X, ListPlus } from 'lucide-react'
import TodoContent from '../TodoContent/TodoContent.jsx'
import TodoHeader from '../TodoHeader/TodoHeader'

const Todo = () => {
    const [showAddTodo, setShowAddTodo] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const dispatch = useDispatch()

    const handleCreateTodo = async () => {
        if (!title?.trim()) return;

        try {
            const response = await api.post("/todo/todos", { title, description: description || "" })
            if (response.data.success) {
                dispatch(addTodo(response.data.data))
                console.log(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }

        setTitle('')
        setDescription('')
        setShowAddTodo(false)
    }

    const handleClose = () => {
        setTitle('')
        setDescription('')
        setShowAddTodo(false)
    }

    return (
        <div className="w-full min-h-screen ">

            <div className='flex justify-center'>
                <TodoHeader
                    onAddTodo={() => setShowAddTodo(true)}
                />

                {showAddTodo && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">

                        <div className="w-full max-w-[720px] bg-white rounded-2xl shadow-2xl p-8">

                            {/* Header */}
                            <div className="flex items-center justify-between mb-7">

                                <div className="flex items-center gap-3">
                                    <ListPlus
                                        size={25}
                                        strokeWidth={2.2}
                                        className="text-indigo-600"
                                    />

                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        New Todo
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="text-gray-500 hover:text-gray-800 transition"
                                >
                                    <X size={25} />
                                </button>

                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Complete today's assignment"
                                    autoFocus
                                    className="w-full h-12 px-4 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCreateTodo()
                                        }
                                    }}
                                />
                            </div>

                            {/* Description */}
                            <div className="mt-5">
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add some details about this todo..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end items-center gap-3 mt-8">

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCreateTodo}
                                    disabled={!title.trim()}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                                >
                                    Create Todo
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

