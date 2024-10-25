import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({user: null});
    const updateAuthUser = (user) => {
        setAuth((prevAuth) => ({ ...prevAuth, user }));
      };

    return (
        <AuthContext.Provider value={{ auth, setAuth, updateAuthUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;