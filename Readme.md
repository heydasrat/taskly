# Taskly

A clean, responsive full-stack Todo application with a React frontend and a Node/Express/MongoDB backend. It supports user authentication, profile management (with avatar/cover image uploads), and Todo creation, built with a layered, maintainable architecture on both ends.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Authentication Flow](#authentication-flow)
- [API Reference](#api-reference)
- [Frontend State Management](#frontend-state-management)
- [Todo Flow](#todo-flow)
- [Account Settings](#account-settings)
- [File Uploads](#file-uploads)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Response Convention](#api-response-convention)
- [Production Considerations](#production-considerations)
- [Contributing](#contributing)
- [License](#license)

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI development |
| Vite | Dev server & production build |
| Redux Toolkit | Global state management |
| React Redux | Connecting components to Redux |
| React Router | Client-side routing |
| Axios | Backend API communication |
| Tailwind CSS | Styling & responsive UI |
| Lucide React | UI icons |
| ESLint | Code quality |

### Backend

- Node.js
- Express.js
- MongoDB / Mongoose
- JWT authentication
- Multer (multipart file uploads)
- JavaScript ES Modules

---

## Project Structure

```
full-stack-todo/
│
├── backend/
│   ├── controllers/
│   │   ├── user.controller.js
│   │   └── userManagement.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── userManagement.routes.js
│   │   └── todo.routes.js
│   ├── utils/
│   ├── app.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── app/
    │   │   ├── features/
    │   │   │   ├── authSlice.js
    │   │   │   └── todoSlice.js
    │   │   └── store/
    │   │       └── store.js
    │   ├── assets/
    │   ├── components/
    │   │   ├── Axios/
    │   │   ├── Error/
    │   │   ├── Home/
    │   │   ├── Login/
    │   │   ├── NavBar/
    │   │   ├── Register/
    │   │   ├── Setting/
    │   │   ├── Todo/
    │   │   ├── TodoCard/
    │   │   ├── TodoContent/
    │   │   └── TodoHeader/
    │   ├── Pages/
    │   │   ├── Home/
    │   │   ├── Login/
    │   │   ├── Register/
    │   │   ├── Setting/
    │   │   └── index.js
    │   ├── routes/
    │   │   ├── AuthRoutes/
    │   │   ├── ProtectedRoutes/
    │   │   ├── PublicRoutes/
    │   │   └── index.js
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

> Your exact backend folders may differ slightly — the important separation is between routes, controllers, middleware, and models.

---

## Architecture

**Backend** follows a layered request flow:

```
Routes → Middleware → Controllers → Models / Database → Response
```

- **Routes** – define HTTP methods, endpoints, and which middleware/controller handles them. Kept lightweight.
- **Middleware** – handles cross-cutting concerns like authentication (`verifyJWT`) and file uploads (`upload`).
- **Controllers** – contain the actual application logic (`user.controller.js`, `userManagement.controller.js`).
- **Models** – define MongoDB data structure via Mongoose.

**Frontend** keeps responsibilities separated:

- `components/` – reusable UI and feature components
- `Pages/` – application-level pages
- `routes/` – access control (Auth / Protected / Public routes)
- `app/features/` – Redux slices
- `app/store/` – Redux store configuration
- `Axios/` – shared API client

### Overall Flow

```
┌──────────────────────┐
│      React App       │
│  Components / Pages  │
└──────────┬───────────┘
           │ Axios (withCredentials)
           ▼
┌──────────────────────┐
│    Express API       │
│ Routes + Middleware  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ MongoDB / Mongoose   │
└──────────────────────┘
```

---

## Authentication Flow

```
Register → Login → Backend authenticates user → User stored in Redux
    → Protected routes become available → User accesses Todo app
```

- Login sends `{ identifier, password }` to `POST /auth/login`.
- On success, the returned user is dispatched into the Redux auth slice.
- Protected routes use the `verifyJWT` middleware on the backend:

```js
router
    .route("/logout")
    .post(verifyJWT, logout)
```

```
Client Request → Express Router → verifyJWT → Controller → Response
```

- The app supports redirecting a user back to the protected page they originally tried to access.
- The frontend sends requests with `withCredentials: true` so auth cookies are included.

---

## API Reference

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` | No | Register a user |
| POST | `/auth/login` | No | Login |
| POST | `/auth/logout` | Yes | Logout |
| GET | `/auth/me` | Yes | Get current user |
| PATCH | `/user/change-password` | Yes | Change password |
| PATCH | `/user/update-profile` | Yes | Update profile |
| POST | `/todo/todos` | Yes | Create Todo |

> The Todo endpoint is documented from the frontend integration; its full backend route/controller implementation wasn't included in the provided backend source.

### Register — `POST /auth/register`

Creates a new user account. Accepts optional multipart fields:

```js
upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
])
```

### Login — `POST /auth/login`

```json
{
    "identifier": "username-or-email",
    "password": "your-password"
}
```

Returns the authenticated user and establishes the auth state used by protected endpoints.

### Logout — `POST /auth/logout`
Requires `verifyJWT`.

### Current User — `GET /auth/me`
Requires `verifyJWT`. Returns the currently authenticated user.

### Change Password — `PATCH /user/change-password`

```json
{
    "oldPassword": "current-password",
    "newPassword": "new-password"
}
```

Requires `verifyJWT`. Frontend validates the new password is at least 8 characters before submitting.

### Update Profile — `PATCH /user/update-profile`

Requires `verifyJWT`. Accepts multipart form data:

- `username`
- `fullName`
- `avatar` (max 1)
- `coverImage` (max 1)

```js
router
    .route("/update-profile")
    .patch(
        verifyJWT,
        upload.fields([
            { name: "avatar", maxCount: 1 },
            { name: "coverImage", maxCount: 1 }
        ]),
        updateProfile
    )
```

### Create Todo — `POST /todo/todos`

Requires auth. Body contains `title` and `description`. On success, the returned Todo is added to the Redux store.

---

## Frontend State Management

Redux Toolkit manages global state via two slices:

```
Redux Store
│
├── auth
│   ├── isLoading
│   ├── isAuthenticated
│   └── user
│
└── todo
    ├── todos
    └── isLoading
```

**Auth slice actions:** `login()`, `logout()`, `setLoading()`

**Todo slice actions:** `addTodo()`, `setTodos()`, `setLoading()`, `removeTodo()`, `updateTodo()`, `toggleTodo()`

Todos are matched by their `_id`, matching the MongoDB/Mongoose backend structure.

### API Layer

A single shared Axios instance is used instead of per-component configs:

```js
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})
```

---

## Todo Flow

```
Todo
├── TodoHeader
├── TodoContent
└── TodoCard
```

A new Todo contains a **Title** and **Description**, sent via `POST /todo/todos`. On success, it's added to the Redux store.

---

## Account Settings

### Profile
Users can update username, full name, and profile picture (JPEG, previewed locally before upload). Sent via `PATCH /user/update-profile` using `FormData`.

### Password
Users can change their password via `PATCH /user/change-password`. The frontend enforces a minimum length of 8 characters before submitting.

---

## File Uploads

Multer handles multipart form-data on the backend for:

- `avatar` (maxCount: 1)
- `coverImage` (maxCount: 1)

The frontend sends these as part of a `FormData` request.

---

## Environment Variables

### Backend `.env`

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env`

```
VITE_API_URL=http://localhost:5000
```

Never commit real secrets, credentials, or `.env` files to version control.

---

## Getting Started

### Backend

```bash
cd backend
npm install
# create .env with the required variables
npm run dev     # development
npm start       # production
```

### Frontend

```bash
cd frontend
npm install
# create .env with VITE_API_URL
npm run dev
```

Make sure the backend is running before testing authenticated or Todo-related functionality on the frontend.

---

## Available Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates the production build |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

### Backend

Use the scripts defined in `backend/package.json` (typically `npm run dev` and `npm start`).

---

## API Response Convention

The frontend expects responses in this shape:

```json
{
    "success": true,
    "data": {},
    "message": "..."
}
```

Data is read from `response.data.data`, and success is checked via `response.data.success`. Keeping this consistent across the backend makes frontend API handling predictable.

---

## Production Considerations

- Use strong, private JWT secrets.
- Keep database credentials outside source control.
- Configure CORS to allow only trusted frontend origins.
- Use HTTPS in production.
- Configure authentication cookies correctly for the production domain.
- Validate uploaded files server-side; restrict size and file types.
- Validate and sanitize all user input.
- Return consistent API response structures.
- Avoid exposing internal error details to clients.
- Add centralized error handling, request logging, and monitoring.
- Use appropriate MongoDB indexes for frequently queried fields.
- Keep development-only logging out of production.
- Set the production `VITE_API_URL` and never expose secrets through Vite env variables.
- Run `npm run build` and deploy the generated `dist/` directory to your preferred static host.

> These are recommendations for deployment — not a claim that every item is already implemented in the current codebase.

---

## Contributing

When adding a new full-stack feature:

1. **Backend:** create/update the model → add controller logic → add middleware if needed → add the route → connect it to the Express app → test independently.
2. **Frontend:** build the component → wire it to the relevant Redux slice → connect the API request → connect the UI only once the backend behavior is stable.

```
New Todo feature
    ↓
Todo component
    ↓
Todo Redux slice
    ↓
API request
```

Keeping responsibilities separated on both ends makes the codebase easier to review, test, and extend.

---

## License

Add your preferred license here.

---

Built as **Taskly** — a full-stack Todo application with React/Redux on the frontend and Express/MongoDB on the backend — with authentication, account management, and Todo features kept cleanly separated so the project can grow without becoming hard to maintain.