import { Navigate,Outlet } from "react-router-dom"
import useAuthStatus from "../hooks/useAuthStatus"
import Spinner from "./Spinner"
const PrivateRoute = () => {
    
    const {loggedIn,checkingStatus}=useAuthStatus()

    if(checkingStatus){
        return <h3><Spinner/></h3>
    }

// what ever that will be wrapped up between the 
//routes calling the private route tag will be 
//redirected to it
  return loggedIn?<Outlet/> :<Navigate to='/sign-in'/> 
}

export default PrivateRoute
