import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to='/'>
    <div style={styles.logo}>
      <img src="logo.png" alt="App Logo that consists of a large, modern lowercase 'E' coloured in transparent blue & purple, followed by 'Eventure' written normally in black font" width="100" />
    </div>
    </Link>
  );
};

const styles = {
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  }
};

export default Logo;
