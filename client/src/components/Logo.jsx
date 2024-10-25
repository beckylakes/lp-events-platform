import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to='/'>
    <div>
      <img id='logo' src="../../public/logo-transparent.png" alt="App Logo that consists of a large, modern lowercase 'E' coloured in transparent blue & purple, followed by 'Eventure' written normally in black font" width="100" />
    </div>
    </Link>
  );
};

export default Logo;
