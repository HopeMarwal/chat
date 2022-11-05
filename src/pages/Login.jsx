import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from '../firebase';


export default function Login() {
  const [err, setErr] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch (err) {
      setErr(true)
    }


  }

  return (
    <div className='form-container'>
      <div className='form-wrapper'>
        <span className='logo'>Chat</span>
        <span className='title'>Login</span>

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder='User email' />
          <input type="password" placeholder='User password' />
          <button className='btn'>Sign in</button>
          {err && <span className='error'>Oops... Wrong email or password... Try again</span>}
        </form>

        <p>Do you not have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}