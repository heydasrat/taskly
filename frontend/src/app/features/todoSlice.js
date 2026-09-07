import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    todos: [],
    isLoading: false,

};

const todoSlice = createSlice({
    name: "todo",
    initialState,

    reducers: {
        addTodo: (state, action) => {
            state.todos.push(action.payload);
        },


        setTodos: (state, action) => {
            state.todos = action.payload;
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        removeTodo: (state, action) => {
            state.todos = state.todos.filter(
                (todo) => todo._id !== action.payload
            )
        },
        updateTodo: (state, action) => {
            state.todos = state.todos.map((todo) =>
                todo._id === action.payload._id
                    ? action.payload
                    : todo
            )
        },
        toggleTodo: (state, action) => {
            state.todos = state.todos.map((todo) =>
                todo._id === action.payload._id
                    ? action.payload
                    : todo
            )
        }


    },
});

export const {
    addTodo,
    setTodos,
    setLoading,
    removeTodo,
    updateTodo,
    toggleTodo

} = todoSlice.actions;

export default todoSlice.reducer;