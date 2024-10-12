import { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "../context/AuthProvider"
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMessage("");
  }, [email, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password)
      .then(({ msg, user }) => {
        if (msg === "Logged in successfully") {
          console.log(`Logged in successfully as ${user.username}`);
          setAuth(user)
          setEmail("");
          setPassword("");
          setSuccess(true);
          navigate("/");
        }
      })
      .catch((err) => {
        // Sorry! That password is incorrect
        // Sorry! That user doesn't exist
        console.log(err.response.data.msg);
      });


  };

  return (
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <Link to="/">Go to Home</Link>
        </section>
      ) : (
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
      )}
    </>
  );
};

export default Login;
