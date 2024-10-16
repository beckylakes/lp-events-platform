import { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../api/api";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMessage("");
  }, [email, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password)
      .then(({ msg, roles, user, accessToken }) => {
        console.log(`Logged in successfully as ${user.username}`, user);
        setAuth({ user, password, roles, accessToken });
        setEmail("");
        setPassword("");
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.log(err);
        if (!err?.response) {
          setErrorMessage("No Server Response");
        } else {
          setErrorMessage(err.response.data.msg);
        }
        errRef.current.focus();
      });
  };

  return (
    <section>
      <p
        ref={errRef}
        className={errorMessage ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errorMessage}
      </p>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        New user? <Link to="/signup">Sign Up</Link>
      </p>
    </section>
  );
};

export default Login;
