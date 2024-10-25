import axios from "axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    console.log('in useRefreshToken')
    const refresh = async () => {
        axios.defaults.withCredentials = true
        axios.defaults.baseURL = "https://eventure-4z44.onrender.com/api/"
        const response = await axios.post('users/refresh', {}, {withCredentials: true});
        console.log('in refresh')
        console.log(response)
        setAuth(prev => {
            return {
                ...prev,
                user: {
                    username: response.data.username, 
                    avatar: response.data.avatar, 
                    _id: response.data._id,
                    roles: response.data.roles
                  },
                roles: response.data.roles,
                accessToken: response.data.accessToken
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
