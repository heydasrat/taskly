# Taskly

Taskly is a full-stack todo application built with React on the frontend and Node.js/Express with MongoDB on the backend. The current implementation includes user registration, email verification, login/logout, password reset flows, profile management, and a per-user todo dashboard.

This README reflects the features that are actually implemented in the codebase as of the current project state.

## 1. Project overview

Taskly is a personal task management app with authenticated user accounts. Users can create an account, verify their email, sign in, manage their profile, and create, view, search, edit, complete, and delete todos.

The app has a layered architecture:

- Frontend: React + Vite + Redux Toolkit + React Router
- Backend: Express + MongoDB + Mongoose
- Authentication: JWT stored in HTTP-only cookies
- File uploads: Cloudinary integration for avatar uploads
- Email delivery: Gmail OAuth2 SMTP via Nodemailer

## 2. Features

### Implemented user features

- User registration with full name, email, username, and password
- Email verification via 6-digit OTP sent to the registered email
- Login using either username or email
- Logout using a JWT-based server-side session
- Fetch current authenticated user from backend
- Password reset flow using email OTP verification and reset token
- Change password for authenticated users
- Profile update for username and full name
- Avatar upload for authenticated users
- Remove profile avatar
- Todo creation, listing, search, update, completion toggle, and deletion
- Protected routes for authenticated users
- Redux-managed auth and todo state on the frontend

### Frontend-only UI behaviors

- Login page with password visibility toggle
- Registration page
- Email verification page with 6-digit code entry and resend option
- Forgot password page
- OTP verification page
- Reset password page
- Settings page for profile and password updates
- Home page with todo summary and add-todo modal
- Todo list with inline search
- Todo edit modal and delete confirmation modal
- Navbar with user avatar, email, username, and logout action

## 3. Frontend features

The frontend is in the `frontend/` folder and is built with Vite.

Key frontend capabilities:

- Client-side routing with React Router
- Protected and auth-only route guards
- Redux slices for auth and todo state
- Shared Axios instance configured with `withCredentials: true`
- Request flow that calls backend API under `/v1/api`
- Todo UI implementing create, search, edit, delete, and toggle completion
- Settings UI for profile and password updates
- File input for JPEG profile image upload

Notable frontend implementation details:

- `App.jsx` loads the current user on startup using `GET /auth/me`
- `ProtectedRoutes.jsx` blocks unauthenticated users from protected pages
- `AuthRoutes.jsx` redirects authenticated users away from login/register pages
- `authSlice.js` stores `isLoading`, `isAuthenticated`, and `user`
- `todoSlice.js` stores a list of todos and loading state

## 4. Backend features

The backend is in the `backend/` folder and uses ES modules.

Implemented backend features:

- Express server configured with CORS, JSON parsing, URL encoding, cookie parsing, and rate limiting
- MongoDB connection via Mongoose
- User model with username, full name, email, password, refresh token, avatar, and verification status
- Todo model linked to a user
- OTP model for email verification and reset flows
- Password reset model entry, although the actual reset flow uses JWT tokens and OTP verification instead of storing reset records in a persistent table
- Error handling with custom `ApiError` and `ApiResponse`
- JWT generation for access and refresh tokens
- Protected middleware for route authorization
- Cloudinary upload helper for avatar storage
- Email sending via Gmail OAuth2

## 5. Authentication and authorization

Authentication is implemented with JWT and cookies.

How it works:

- On login, the backend generates an access token and refresh token
- Both tokens are set as HTTP-only cookies
- `verifyJWT` reads the access token from `req.cookies.accessToken` or the Authorization header
- The token payload is decoded and the user is loaded from MongoDB before the request continues
- Routes under `/v1/api/auth` and `/v1/api/user` and `/v1/api/todo` are protected as needed

Important implementation facts:

- Authentication is cookie-based and uses `withCredentials: true` in the frontend
- Access tokens are not refreshed through a dedicated refresh endpoint in the code
- The app uses a single authenticated user flow; there is no refresh-token endpoint or token rotation flow implemented in the API
- `verifyJWT` runs on protected endpoints, but there is no role-based authorization system in place

## 6. User roles

There is no implemented role system in the app.

Evidence from the code:

- The `User` model contains a commented-out `role` field rather than an active role schema
- No role checks are performed in controllers or middleware
- No admin/user distinction is enforced in routes or UI

The effective model is: all authenticated users are treated as standard users.

## 7. Database

The backend uses MongoDB with Mongoose.

Database configuration:

- Connection string from `backend/.env` via `MONGODB_URI`
- Database name is defined in `backend/src/constant.js` as `inkora`
- MongoDB connection is created in `backend/src/db/index.js`

Collections / models used:

- `User`
- `Todo`
- `OTP`
- `PasswordReset` (defined, but not heavily used as the actual reset flow is token-based)

Document relationships:

- Each `Todo` has a `user` field referencing a `User` document
- `OTP` entries are keyed by email and expire automatically due to the `expiresAt` index

## 8. API endpoints

All endpoints are mounted under the API prefix `/v1/api`.

### Authentication endpoints

| Method | Endpoint | Auth required | Description |
| --- | --- | --- | --- |
| POST | `/v1/api/auth/register` | No | Register a new user and send OTP email |
| POST | `/v1/api/auth/verify-email` | No | Verify newly registered email with OTP |
| POST | `/v1/api/auth/login` | No | Login using username or email |
| POST | `/v1/api/auth/logout` | Yes | Clear cookies and log user out |
| GET | `/v1/api/auth/me` | Yes | Return current authenticated user |
| POST | `/v1/api/auth/request-password-reset` | No | Send password reset OTP |
| POST | `/v1/api/auth/verify-otp` | No | Verify reset code and return a reset token |
| PATCH | `/v1/api/auth/reset-password` | No | Set a new password with a valid reset token |
| POST | `/v1/api/auth/resend-otp` | No | Resend email verification OTP |

### User management endpoints

| Method | Endpoint | Auth required | Description |
| --- | --- | --- | --- |
| PATCH | `/v1/api/user/change-password` | Yes | Change the current user's password |
| PATCH | `/v1/api/user/update-profile` | Yes | Update username/full name and optionally upload avatar |
| PATCH | `/v1/api/user/delete-avatar` | Yes | Remove the current user's avatar |

### Todo endpoints

| Method | Endpoint | Auth required | Description |
| --- | --- | --- | --- |
| GET | `/v1/api/todo/todos` | Yes | Get all todos for the logged-in user |
| POST | `/v1/api/todo/todos` | Yes | Create a todo |
| GET | `/v1/api/todo/todos/:todoId` | Yes | Get one todo by ID |
| PATCH | `/v1/api/todo/todos/:todoId` | Yes | Update a todo |
| PATCH | `/v1/api/todo/todos/:todoId/toggle` | Yes | Toggle completion status |
| DELETE | `/v1/api/todo/todos/:todoId` | Yes | Delete a todo |

### Request and response conventions

The backend uses a wrapper pattern:

- `ApiResponse` adds `success`, `statusCode`, `data`, and `message`
- `ApiError` is thrown for validation and authorization errors
- Error middleware sends a JSON response with `success`, `message`, and `errors`

## 9. Project structure

```text
Full Stack Todo/
├── backend/
│   ├── .env
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── app.js
│       ├── index.js
│       ├── constant.js
│       ├── config/
│       │   └── config.js
│       ├── controllers/
│       │   ├── todo.controller.js
│       │   ├── user.controller.js
│       │   └── userManagement.controller.js
│       ├── db/
│       │   └── index.js
│       ├── middlewares/
│       │   ├── auth.middleware.js
│       │   └── multer.middleware.js
│       ├── models/
│       │   ├── PasswordReset.model.js
│       │   ├── otp.model.js
│       │   ├── todo.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── todo.route.js
│       │   ├── user.route.js
│       │   └── userManagement.route.js
│       ├── service/
│       │   └── email.service.js
│       └── utils/
│           ├── ApiError.js
│           ├── ApiResponse.js
│           ├── asyncHandler.js
│           ├── otp.utils.js
│           └── uploadOnCloudinary.js
├── frontend/
│   ├── .env
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── app/
│       │   ├── features/
│       │   │   ├── authSlice.js
│       │   │   └── todoSlice.js
│       │   └── store/
│       │       └── store.js
│       ├── components/
│       │   ├── Axios/Axios.js
│       │   ├── Error/Error.jsx
│       │   ├── ForgotPasswordCMP/ForgotPasswordCMP.jsx
│       │   ├── Home/Home.jsx
│       │   ├── Login/Login.jsx
│       │   ├── NavBar/Navbar.jsx
│       │   ├── Register/Register.jsx
│       │   ├── ResetPasswordCMP/ResetPasswordCMP.jsx
│       │   ├── Setting/SettingCMP.jsx
│       │   ├── Todo/Todo.jsx
│       │   ├── TodoCard/TodoCard.jsx
│       │   ├── TodoContent/TodoContent.jsx
│       │   ├── TodoHeader/TodoHeader.jsx
│       │   ├── VerifyEmail/VerifyEmailCMP.jsx
│       │   ├── VerifyOTPCMP/VerifyOTPCMP.jsx
│       │   └── index.js
│       ├── Pages/
│       │   ├── ForgotPassword/ForgotPassword.jsx
│       │   ├── Home/Home.jsx
│       │   ├── Login/Login.jsx
│       │   ├── Register/Register.jsx
│       │   ├── ResetPassword/ResetPassword.jsx
│       │   ├── Setting/Setting.jsx
│       │   ├── VerifyEmail/VerifyEmail.jsx
│       │   ├── VerifyOTP/VerifyOTP.jsx
│       │   └── index.js
│       └── routes/
│           ├── AuthRoutes/AuthRoutes.jsx
│           ├── ProtectedRoutes/ProtectedRoutes.jsx
│           ├── PublicRoutes/PublicRoutes.jsx
│           └── index.js
├── Readme.md
└── package.json
```

## 10. Setup and installation

### Prerequisites

- Node.js and npm
- MongoDB Atlas connection or local MongoDB instance
- Cloudinary account for avatar uploads
- Gmail account with OAuth2 app credentials for email sending

### Installation

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Create the required environment variables in `backend/.env` and `frontend/.env`.

## 11. Environment variables

### Backend (`backend/.env`)

The backend expects these variables:

```env
PORT=8000
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=...
ACCESS_TOKEN_EXPIRY=5d
REFRESH_TOKEN_SECRET=...
REFRESH_TOKEN_EXPIRY=30d
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
EMAIL_USER=...
RESET_PASSWORD_TOKEN=...
RESET_PASSWORD_TOKEN_EXPIRY=10m
```

These are validated in `backend/src/config/config.js` at startup.

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000/v1/api
```

## 12. How to run frontend

From the frontend folder:

```bash
cd frontend
npm run dev
```

The frontend dev server starts with Vite and typically runs on:

- http://localhost:5173

## 13. How to run backend

From the backend folder:

```bash
cd backend
npm run dev
```

This runs the Express server via `nodemon src/index.js`.

The backend listens on the value from `PORT` in `backend/.env`, which is currently set to 8000.

## 14. Available npm scripts

### Backend scripts

From `backend/package.json`:

```json
"scripts": {
  "dev": "nodemon src/index.js"
}
```

### Frontend scripts

From `frontend/package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## 15. Important technical details

- The project uses ES modules (`"type": "module"`) in both frontend and backend
- The backend uses Express 5
- The frontend uses React 19 and Vite 8
- JWT access tokens are stored in cookies with `httpOnly` and `secure` flags
- Middleware enforces request rate limiting:
  - global rate limit: about 100 requests per 15 minutes
  - auth limiter: about 10 requests per 15 minutes
- Avatar uploads are processed with Multer and Cloudinary
- Email verification and password reset use 6-digit OTPs
- All protected routes are user-scoped; a todo only belongs to the authenticated user
- The frontend app relies on Redux for auth and todo state, not a query library like React Query

## 16. Known limitations and caveats

These limitations are visible from the code and are not assumptions:

- There is no implemented admin/user role system; role-based authorization is not active
- There is no dedicated refresh-token endpoint or refresh flow implemented
- There is no logout or session invalidation beyond clearing cookies on the client and clearing the refresh token in the database
- `deleteAvatar` on the backend does not remove the old avatar from Cloudinary if `public_id` is missing or if the `user.avatar` object is null; it is a simple nulling flow
- The todo API returns `404` when no todos are found, which is not a common REST pattern for empty collections
- The frontend includes the `@react-oauth/google` dependency, but the actual Google login flow is not implemented in the current UI or backend routes
- There is no root-level monorepo script or workspace script; the project is split into separate backend and frontend apps
- There are no automated tests implemented in the repository
- The `PasswordReset` model exists, but the actual reset flow is primarily driven by JWT token verification and OTP checks, not a database-backed reset record lifecycle
- The app accepts only JPEG avatar uploads (`.jpg` / `.jpeg`) in the frontend and backend validation

## Summary

This project is a working personal todo application with account management, email verification, password recovery, and authenticated todo storage. It does not currently include role-based access control, Google sign-in, or a full refresh-token architecture, and the README above documents only the features that are actually present in the current code.

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