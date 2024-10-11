import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password)
      .then(({ msg, user }) => {
        if (msg === "Logged in successfully") {
          console.log(`Logged in successfully as ${user.username}`);
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
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="input-box">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <button type="submit">Log In</button>
      </form>
      <p>
        New user? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
