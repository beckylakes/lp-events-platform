import React from "react";
import SearchBar from "./SearchBar";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";

const NavigationBar = () => {
  return (
    <nav style={styles.nav}>
      <SearchBar />
      <LoginButton />
      <SignUpButton />
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
