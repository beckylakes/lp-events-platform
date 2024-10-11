import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postUser } from "../utils/api";

const SignUp = () => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    postUser(username, email, password).then(({user, msg}) => {
        // New user created
        console.log(msg)
        navigate('/')
    }).catch((err) => {
        //Sorry! That email is already taken
        console.log(err.response.data.msg)
    })
  }

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Create an account:</h1>
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
          <label htmlFor="username">Name</label>
          <input
            type="text"
            placeholder="Enter Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
        <div className="input-box">
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Enter Password" required onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login Here</Link>
      </p>
    </div>
  );
};
export default SignUp;
