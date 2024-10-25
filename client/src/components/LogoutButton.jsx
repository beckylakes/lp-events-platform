import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";

const LogoutButton = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
