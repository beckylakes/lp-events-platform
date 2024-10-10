import React from 'react';

const Logo = () => {
  return (
    <div style={styles.logo}>
      <img src="logo.png" alt="App Logo that consists of a large, modern lowercase 'E' coloured in transparent blue & purple, followed by 'Eventure' written normally in black font" width="100" />
    </div>
  );
};

const styles = {
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  }
};

export default Logo;
