
import useAuth from "./useAuth";
import { api } from "../api/api";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    console.log('in useRefreshToken')
    const refresh = async () => { 
        const response = await api.post('users/refresh', {}, {withCredentials: true});
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
