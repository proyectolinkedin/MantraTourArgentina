import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"


const ProtectedUser = () => {

  const {isLogged} = useContext(AuthContext)

  return <>
  {
    isLogged? <Outlet/> : <Navigate to="/login"/>
  }
  
  </>
  }

export default ProtectedUser