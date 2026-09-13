# Taskly

Taskly is a full-stack todo application. Users can create and verify an account, sign in with a username or email address, manage their profile, and create, search, edit, complete, and delete personal todos.

The repository contains two independent npm applications:

- `frontend/`: React client built with Vite.
- `backend/`: Express API backed by MongoDB and Mongoose.

## Features

### Frontend

- Registration with full name, email, username, and password.
- Six-digit email verification flow with resend support.
- Login with username or email.
- Password visibility controls and client-side form validation.
- Password reset flow using an email OTP and reset token.
- Protected home and settings routes.
- Create, list, edit, complete, and delete todos.
- Case-insensitive search across todo titles and descriptions.
- Todo counts for all, completed, and pending items.
- Delete confirmation modal and edit modal.
- Profile editing for username and full name.
- JPEG avatar preview, upload, and removal.
- Light and dark theme selection saved through the API.
- Loading indicators, skeleton todo cards, and backend error messages in the main forms.

### Backend and platform

- JWT access and refresh token authentication.
- HTTP-only, secure, `sameSite: "strict"` authentication cookies.
- Bearer-token support in the authentication middleware.
- Per-user todo ownership checks on every todo operation.
- Bcrypt password hashing.
- Email verification and password-reset OTPs with ten-minute expiry and a MongoDB TTL index.
- Gmail OAuth2 email delivery through Nodemailer.
- Cloudinary avatar uploads.
- Helmet security headers, CORS with credentials, request-size limits, and rate limiting.
- Consistent success and error response wrappers.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router DOM
- Redux Toolkit and React Redux
- Axios
- Tailwind CSS
- Lucide and Lucide React icons

The frontend also declares `@react-oauth/google`, but no Google login flow or corresponding backend route is implemented.

### Backend

- Node.js with ES modules
- Express 5
- JSON Web Token (`jsonwebtoken`)
- `bcryptjs`
- `multer` for local multipart handling
- Cloudinary SDK
- Nodemailer
- Helmet
- CORS
- `express-rate-limit`
- `cookie-parser`
- `dotenv`

### Database

- MongoDB
- Mongoose

The connection appends the database name `Taskly` to the configured MongoDB URI.

## Project Architecture

```text
React/Vite frontend
        |
        | Axios requests with credentials
        v
Express API (/v1/api)
        |
        +--> JWT/auth middleware
        +--> Controllers and response/error utilities
        +--> Mongoose models
        |         |
        |         v
        |     MongoDB database (taskly)
        |
        +--> Nodemailer/Gmail OAuth2 for OTP email
        +--> Cloudinary for avatar storage
```

The frontend uses the `VITE_API_URL` value as its Axios base URL. Authentication state and todos are held in Redux memory during the current browser session. The backend reads and writes users, todos, and OTP documents through Mongoose.

## Project Structure

```text
Full Stack Todo/
├── Readme.md
├── backend/
│   ├── package.json
│   ├── public/
│   │   └── temp/
│   └── src/
│       ├── app.js
│       ├── constant.js
│       ├── index.js
│       ├── config/config.js
│       ├── controllers/
│       │   ├── todo.controller.js
│       │   ├── user.controller.js
│       │   └── userManagement.controller.js
│       ├── db/index.js
│       ├── middlewares/
│       │   ├── auth.middleware.js
│       │   └── multer.middleware.js
│       ├── models/
│       │   ├── otp.model.js
│       │   ├── PasswordReset.model.js
│       │   ├── todo.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── todo.route.js
│       │   ├── user.route.js
│       │   └── userManagement.route.js
│       ├── service/email.service.js
│       └── utils/
│           ├── ApiError.js
│           ├── ApiResponse.js
│           ├── asyncHandler.js
│           ├── otp.utils.js
│           └── uploadOnCloudinary.js
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── eslint.config.js
    ├── public/
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── app/
        │   ├── features/authSlice.js
        │   ├── features/todoSlice.js
        │   └── store/store.js
        ├── components/
        │   ├── Axios/Axios.js
        │   ├── Error/Error.jsx
        │   ├── ForgotPasswordCMP/ForgotPasswordCMP.jsx
        │   ├── Home/Home.jsx
        │   ├── Login/Login.jsx
        │   ├── NavBar/Navbar.jsx
        │   ├── Register/Register.jsx
        │   ├── ResetPasswordCMP/ResetPasswordCMP.jsx
        │   ├── Setting/SettingCMP.jsx
        │   ├── Todo/Todo.jsx
        │   ├── TodoCard/TodoCard.jsx
        │   ├── TodoContent/TodoContent.jsx
        │   ├── TodoHeader/TodoHeader.jsx
        │   ├── VerifyEmail/VerifyEmailCMP.jsx
        │   ├── VerifyOTPCMP/VerifyOTPCMP.jsx
        │   └── index.js
        ├── Pages/
        └── routes/
            ├── AuthRoutes/AuthRoutes.jsx
            ├── ProtectedRoutes/ProtectedRoutes.jsx
            ├── PublicRoutes/PublicRoutes.jsx
            └── index.js
```

`backend/src/routes` mounts endpoint groups, controllers contain request handling, models define MongoDB documents, and utilities provide response, error, OTP, and Cloudinary helpers. In the frontend, `Pages` compose screens from reusable `components`; `app/features` contains Redux slices; and `routes` contains route guards.

## Authentication and Security

### Authentication flow

1. Registration creates an unverified user and stores a six-digit OTP for ten minutes.
2. Email verification marks the user as verified and removes OTP documents for that email.
3. Login accepts `identifier` as either an email or username. Unverified users cannot log in.
4. Successful login creates access and refresh JWTs, stores the refresh token on the user, and sets both tokens as cookies.
5. Protected requests authenticate with the access-token cookie or an `Authorization: Bearer <token>` header. The middleware verifies the JWT and reloads the user from MongoDB.
6. Logout clears the stored refresh token and both cookies.
7. The refresh endpoint verifies a refresh JWT, creates new tokens, updates the stored refresh token, and sets new cookies.

Access-token payloads contain `_id`, `email`, and `username`. Refresh-token payloads contain `_id`. Cookie settings are `httpOnly`, `secure`, and `sameSite: "strict"`.

### Passwords, OTPs, and authorization

- User passwords are hashed with bcryptjs using a cost factor of 10 before saving.
- Password reset requires a verified account, an email OTP, and a signed reset token.
- The `PasswordReset` model is defined but is not used by the current reset flow.
- Todo queries include both the todo ID and the authenticated user ID, preventing users from reading or changing another user's todos through the implemented routes.
- There is no role-based or administrator authorization system.

### HTTP and request protections

- Helmet is enabled globally.
- CORS allows the configured origin and credentials.
- JSON and URL-encoded bodies are limited to 1 MB.
- All requests have a limit of 100 requests per 15 minutes.
- `/v1/api/auth` and `/v1/api/user` have an additional limit of 10 requests per 15 minutes.
- Mongoose schema validation enforces the documented field constraints.
- Multer writes temporary uploads to `backend/public/temp`; avatar uploads are restricted in the controller to JPEG MIME types before Cloudinary upload.

These controls do not constitute a complete security review. See [Known Limitations](#known-limitations--future-improvements).

## API Documentation

All endpoints are prefixed with `/v1/api`. Unless noted otherwise, successful responses use the shape `{ success, statusCode, data, message }`. Error responses use `{ success, message, errors }`.

### Authentication

| Method | Endpoint | Auth | Request fields | Behavior |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | No | `fullName`, `email`, `username`, `password` | Creates an unverified user, creates an OTP, and sends a verification email. The route accepts multipart `avatar` and `coverImage` fields, but the registration controller does not currently save them. |
| POST | `/auth/verify-email` | No | `email`, `otp` | Verifies the account, deletes its OTPs, and returns the user. |
| POST | `/auth/login` | No | `identifier`, `password` | Authenticates by username or email and sets access and refresh cookies. |
| POST | `/auth/logout` | Yes | None | Clears the stored refresh token and authentication cookies. |
| GET | `/auth/me` | Yes | None | Returns the authenticated user. |
| POST | `/auth/request-password-reset` | No | `email` | Sends a reset OTP for an existing verified user. |
| POST | `/auth/verify-otp` | No | `email`, `otp` | Verifies a reset OTP and returns a signed `resetToken`. |
| PATCH | `/auth/reset-password` | No | `resetToken`, `newPassword`, `confirmPassword` | Verifies the reset token and changes the password. |
| POST | `/auth/resend-otp` | No | `email` | Replaces the OTP for the supplied email and sends another verification email. |
| PATCH | `/auth/refresh-access-token` | No | Refresh-token cookie or Bearer token | Verifies the refresh JWT, generates new tokens, updates the stored refresh token, sets cookies, and returns both tokens in the JSON data. |

### User management

| Method | Endpoint | Auth | Request fields | Behavior |
| --- | --- | --- | --- | --- |
| PATCH | `/user/change-password` | Yes | `oldPassword`, `newPassword` | Verifies the current password and saves the new password. |
| PATCH | `/user/update-profile` | Yes | Multipart `username`, `fullName`, optional `avatar` and `coverImage` | Updates username/full name and optionally uploads a JPEG avatar. The controller processes `avatar`; `coverImage` is accepted by Multer but not stored. |
| PATCH | `/user/delete-avatar` | Yes | None | Clears the stored avatar fields for a verified user. |
| PATCH | `/user/toggle-theme` | Yes | `theme` | Stores the supplied theme value and returns the user. The schema allows `light` and `dark`, although this controller only checks that the value is nonempty. |

### Todos

All todo routes require the access-token middleware.

| Method | Endpoint | Request fields | Behavior |
| --- | --- | --- | --- |
| GET | `/todo/todos` | None | Returns the authenticated user's todos. An empty collection produces a `404` response. |
| POST | `/todo/todos` | `title`, optional `description` | Creates a todo for the authenticated user. |
| GET | `/todo/todos/:todoId` | URL `todoId` | Returns one todo owned by the authenticated user. |
| PATCH | `/todo/todos/:todoId` | `title`, optional `description` | Updates a todo owned by the authenticated user. |
| PATCH | `/todo/todos/:todoId/toggle` | None | Toggles `isCompleted` for an owned todo. |
| DELETE | `/todo/todos/:todoId` | URL `todoId` | Deletes an owned todo. |

## Database Models

### `User`

- `username`: required, unique, lowercase, trimmed, 3-20 characters, letters/numbers/underscores only.
- `fullName`: required, trimmed, 3-50 characters.
- `email`: required, unique, lowercase, trimmed, basic email format validation.
- `password`: required, minimum 8 characters, bcrypt-hashed before save.
- `avatar.url` and `avatar.public_id`: Cloudinary avatar details.
- `preferences.theme`: `light` or `dark`, default `light`.
- `refreshToken`: nullable stored refresh JWT.
- `isVerified`: boolean, default `false`.
- `createdAt` and `updatedAt`: Mongoose timestamps.

### `Todo`

- `user`: required reference to `User`, indexed.
- `title`: required, trimmed, 1-150 characters.
- `description`: trimmed, maximum 1,000 characters, default empty string.
- `isCompleted`: boolean, indexed, default `false`.
- `createdAt` and `updatedAt`: Mongoose timestamps.

### `OTP`

- `email`, `otp`, and `expiresAt` are required.
- `email` is lowercased and trimmed.
- A TTL index on `expiresAt` allows MongoDB to remove expired OTP documents.
- Includes Mongoose timestamps.

### `PasswordReset`

- `userId`: required reference to `User`.
- Includes Mongoose timestamps.
- The model is currently defined but not used by any implemented controller.

## Frontend Architecture

### Routing

The browser router defines these paths:

- Public/auth screens: `/register`, `/login`, `/verify-email`, `/request-password-reset`, `/verify-otp`, and `/reset-password`.
- Protected screens: `/` and `/setting`.
- Public placeholder: `/about`.

`App.jsx` calls `GET /auth/me` during startup and keeps routing in a loading state until authentication is resolved. `AuthRoutes` redirects authenticated users to `/`; `ProtectedRoutes` redirects unauthenticated users to `/login`.

### State and API communication

- The Redux `auth` slice stores `isLoading`, `isAuthenticated`, and `user`.
- The Redux `todo` slice stores `todos` and a shared `isLoading` flag.
- The Axios instance uses `VITE_API_URL` and `withCredentials: true`.
- Redux state is in memory; no persistence layer is configured.
- Home fetches todos on mount. The API returns `404` when no todos exist, and the frontend logs the error and leaves the list empty.
- Todo mutation failures are logged in the todo components; authentication and form failures generally display the backend message.

There is no server-side or client-side sorting behavior. Search is performed locally against the loaded todo title and description.

## Environment Variables

The repository contains environment files with local values. Do not commit those values. Create equivalent files with the variable names below and provide your own values.

### `backend/.env`

```env
PORT=
MONGODB_URI=
CORS_ORIGIN=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
EMAIL_USER=
RESET_PASSWORD_TOKEN=
RESET_PASSWORD_TOKEN_EXPIRY=
```

The backend startup validation requires `PORT`, `MONGODB_URI`, `CORS_ORIGIN`, the access/refresh token settings, and the Cloudinary settings. Email delivery and password reset also depend on the configured Google OAuth2 and reset-token values.

### `frontend/.env`

```env
VITE_API_URL=
```

Set `VITE_API_URL` to the backend API base, including `/v1/api`, for example `http://localhost:<PORT>/v1/api` when developing locally.

## Installation

### Prerequisites

- Node.js and npm.
- A reachable MongoDB instance.
- Cloudinary credentials for avatar uploads.
- Gmail OAuth2 credentials for verification and password-reset email delivery.

Install each application independently:

```bash
cd backend
npm install

cd ../frontend
npm install
```

There is no root `package.json` and no root install command.

## Running Locally

1. Clone the repository and enter it:

   ```bash
   git clone <repository-url>
   cd "Full Stack Todo"
   ```

2. Create `backend/.env` and `frontend/.env` using the variable names above. Set `CORS_ORIGIN` to the frontend origin and `VITE_API_URL` to the API base URL.

3. Start the backend in one terminal:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   The server listens on the configured `PORT` and connects to the `taskly` MongoDB database.

4. Start the frontend in another terminal:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Open the local URL printed by Vite. The frontend and backend must use matching CORS and API URL configuration.

### Available scripts

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Usage

1. Register with a full name, email, username, and password of at least eight characters.
2. Enter the six-digit OTP sent to the email address.
3. Sign in with the username or email address.
4. Create todos with a title and optional description.
5. Search the loaded todos by title or description.
6. Edit, complete, or delete todos. Todo ownership is enforced by the API.
7. Open Settings to change profile details, upload/remove a JPEG avatar, change the password, or select a theme.
8. Use the password-reset screens if the account password is forgotten.

## Known Limitations / Future Improvements

These are implementation gaps or possible improvements, not current features:

- The refresh endpoint does not compare the supplied refresh JWT with the user's stored refresh token, so a still-valid previously issued refresh JWT may remain usable until it expires.
- The refresh endpoint returns refresh and access tokens in JSON as well as setting cookies, increasing exposure compared with cookie-only delivery.
- `resendOTP` does not normalize the email, confirm that a user exists, or confirm that the account is still unverified.
- Email delivery errors are logged and swallowed, so registration or reset requests can return success even when the email was not delivered.
- Avatar deletion clears the stored Cloudinary identifiers but does not delete the remote Cloudinary asset.
- Google OAuth is declared as a frontend dependency and configuration exists, but no working Google authentication flow is implemented.
- The frontend links to `/privacy`, `/terms`, and `/help`, but those routes are not defined. `/about` is only placeholder text.
- There is no todo sorting control or sort implementation.
- The `PasswordReset` model is unused; the current reset flow uses OTP documents and a JWT reset token.
- The backend package has a development script only. No automated test script or test suite is present in the package manifests.
- Registration accepts avatar and cover-image multipart fields at the route level, but the registration controller does not persist either file. Profile updates process only the avatar.
- Secure cookies may require HTTPS in environments where the browser refuses secure cookies over plain HTTP.

## Project Status

The implemented application supports the core account, email verification, password recovery, profile, theme, and per-user todo workflows. It is a development-oriented full-stack project with separate frontend and backend packages. Production deployment, automated tests, and the limitations listed above are not represented as completed functionality.
