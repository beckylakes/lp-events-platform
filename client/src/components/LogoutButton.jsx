import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/api";
import useLogout from "../hooks/useLogout";

const LogoutButton = () => {
  // const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = async() => {
     await logout();
     navigate("/home")
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
