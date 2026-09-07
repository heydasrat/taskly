import { useEffect } from 'react'
import { login, logout, setLoading } from './app/features/authSlice.js'
import { Outlet } from 'react-router-dom'
import { useDispatch } from "react-redux"
import api from './components/Axios/Axios.js'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      dispatch(setLoading(true))
      try {
        const response = await api.get("/auth/me")
        if (response.data.success) {
          dispatch(login(response.data.data))
        } else {
          dispatch(logout())
        }
      } catch (error) {
        dispatch(logout())
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchCurrentUser()
  }, [dispatch])

  return <Outlet />
}

export default App