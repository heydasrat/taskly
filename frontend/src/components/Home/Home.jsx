import Navbar from '../NavBar/Navbar.jsx'
import { useEffect } from 'react'
import Todo from '../Todo/Todo.jsx'
import { setTodos } from '../../app/features/todoSlice.js'
import { useDispatch } from 'react-redux'
import api from '../Axios/Axios.js'

const HomeCMP = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await api.get("/todo/todos", { withCredentials: true })
        if (response.data.success) {
          dispatch(setTodos(response.data.data))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchTodos()
  }, [])



  return (
    <div>
      <Navbar />
      <Todo />
    </div>
  )
}

export default HomeCMP