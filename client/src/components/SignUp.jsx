import React from 'react';

const SignUp = () => {
    return (
        <div className='wrapper'>
            <form action="">
                <h1>Sign Up</h1>
                <div className='input-box'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' placeholder='Enter Email' required></input>
                </div>
                <div className='input-box'>
                    <label htmlFor='first-name'>First Name</label>
                    <input type='text' placeholder='First Name' required></input>
                </div>
                <div className='input-box'>
                    <label htmlFor='last-name'>Email</label>
                    <input type='text' placeholder='Last Name' required></input>
                </div>
                <div className='input-box'>
                <label htmlFor='password'>Password</label>
                <input type='password' placeholder='Enter Password' required></input>
                </div>
                <button>Sign Up</button>
            </form>
        </div>
    )
}
export default SignUp;
