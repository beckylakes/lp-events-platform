import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  console.log('in PersistLogin')
  useEffect(() => {
    const verifyRefreshToken = async () => {
      console.log('in verifyRefreshToken in PersistLogin')
      try {
        console.log('in try block')
        await refresh();
        console.log('after refresh')
        setIsLoading(false);
      } catch {
        setIsLoading(false)
      }
    };
    console.log('after useEffect', auth)
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistLogin;
