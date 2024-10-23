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

  const handleClick = () => {
  navigate('/create-event')
  }

  return (
    <nav style={styles.nav}>
      <SearchBar />
      <button onClick={handleClick}>Create event</button>
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
