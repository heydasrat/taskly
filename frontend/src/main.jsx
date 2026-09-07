import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './app/store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login, Register, Home,Setting } from './Pages/index.js'
import { ProtectedRoutes, PublicRoutes, AuthRoutes } from './routes/index.js'


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
        ]
      },
      {
        element: <ProtectedRoutes />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/setting", element: <Setting/> }
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
    <RouterProvider router={router} />
  </Provider>
)