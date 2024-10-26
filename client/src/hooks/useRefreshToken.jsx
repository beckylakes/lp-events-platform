import axios from "axios";
import useAuth from "./useAuth";
// import useAxiosPrivate from "./useAxiosPrivate";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    // const axiosPrivate = useAxiosPrivate();
    
    console.log('in useRefreshToken')
    const refresh = async () => { 
        const response = await axios.post('https://eventure-4z44.onrender.com/api/users/refresh', {}, {withCredentials: true});
        console.log('in refresh', response)
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
