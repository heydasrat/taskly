import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './app/store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login, Register, Home, Setting, VerifyEmail,ForgotPassword, VerifyOTP,ResetPassword } from './Pages/index.js'
import { ProtectedRoutes, PublicRoutes, AuthRoutes } from './routes/index.js'
import { GoogleOAuthProvider } from '@react-oauth/google'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <AuthRoutes />,
        children: [
          { path: "register", element: <Register /> },
          { path: "login", element: <Login /> },
          { path: "verify-email", element: <VerifyEmail /> },
          { path: "request-password-reset", element: <ForgotPassword /> },
          { path: "verify-otp", element: <VerifyOTP /> },
          { path: "reset-password", element: <ResetPassword /> },
        ]
      },
      {
        element: <ProtectedRoutes />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/setting", element: <Setting /> }
        ]
      }, {
        element: <PublicRoutes />,
        children: [
          {
            path: "/about",
            element: "Hello guys, There will be our team's details"
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId='486340025147-et2eacvhdad5d20ddfjckfdf5b8l1abr.apps.googleusercontent.com'>
    <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </Provider>
)