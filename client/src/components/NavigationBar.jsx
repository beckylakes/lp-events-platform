import React, {useContext} from "react";
import SearchBar from "./SearchBar";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";
import AuthContext from "../context/AuthProvider";

const NavigationBar = () => {
  const { auth } = useContext(AuthContext);

  return (
    <nav style={styles.nav}>
      <SearchBar />
      {auth ? (
        <p>Welcome, {auth.username}!</p>
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
