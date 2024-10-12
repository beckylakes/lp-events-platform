import React, { useContext } from "react";
import SearchBar from "./SearchBar";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";
import AuthContext from "../context/AuthProvider";
import LogoutButton from "./LogoutButton";

const NavigationBar = () => {
  const { auth } = useContext(AuthContext);

  return (
    <nav style={styles.nav}>
      <SearchBar />
      {auth?.user ? (
        <>
          <img id="avatar" src={auth.user.avatar} alt={`${auth.user.username}'s avatar`} />
          <p>{auth.user.username}!</p>
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
