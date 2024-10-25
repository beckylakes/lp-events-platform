import useAuth from "./useAuth";
import axios from "axios";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await axios.post(
        "https://eventure-4z44.onrender.com/api/users/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      throw new err;
    }
  };

  return logout
  
};

export default useLogout;
