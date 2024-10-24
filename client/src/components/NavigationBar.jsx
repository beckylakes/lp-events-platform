import React, { useContext } from "react";
import SearchBar from "./SearchBar";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";
import AuthContext from "../context/AuthProvider";
import LogoutButton from "./LogoutButton";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const NavigationBar = () => {
  const { auth } = useAuth();
  const navigate = useNavigate()

  return (
    <nav style={styles.nav}>
      <SearchBar />
      <button onClick={() => navigate('/home')}>Home</button>
      <button onClick={() => navigate('/create-event')}>Create event</button>
      <button onClick={() => navigate('/myevents')}>My events</button>
      {auth?.user ? (
        <>
          <Link to={`/user/${auth.user._id}`}>
            <img
              id="avatar"
              src={auth.user.avatar}
              alt={`${auth.user.username}'s avatar`}
            />
            <p>Logged in as: {auth.user.username}</p>
          </Link>
          <LogoutButton />
        </>
      ) : (
        <>
          <LoginButton />
          <SignUpButton />
        </>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
  },
};

export default NavigationBar;
