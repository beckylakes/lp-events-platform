import React from 'react';

const Login = () => {
    return (
        <div className='wrapper'>
            <form action="">
                <h1>Login</h1>
                <div className='input-box'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' placeholder='Enter Email' required></input>
                </div>
                <div className='input-box'>
                <label htmlFor='password'>Password</label>
                <input type='password' placeholder='Enter Password' required></input>
                </div>
                <button>Login</button>
            </form>
        </div>
    )
}

export default Login;
