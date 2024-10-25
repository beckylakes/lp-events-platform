import useAuth from "./useAuth";
import axios from "axios";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await axios.post(
        "http://localhost:9090/api/users/logout",
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
