import { Router } from "express";

import {
    createTodo,
    getTodos,
    getTodoById,
    updateTodo,
    toggleComplete,
    deleteTodo,
} from "../controllers/todo.controller.js";

import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router
    .route("/todos")
    .post(createTodo)
    .get(getTodos);

router
    .route("/todos/:todoId")
    .get(getTodoById)
    .patch(updateTodo)
    .delete(deleteTodo);

router.patch(
    "/todos/:todoId/toggle",
    toggleComplete
);

export default router;