import React from 'react'
import Form from '../components/Form'
import "../styles/Login.css"
import {useLocation,useNavigate} from  'react-router-dom'


export default function Register() {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const navigateTo = useNavigate();  

  return (
    <div style={{textAlign: "center", width: "100%", marginTop: "140px"}}>
      <Form url={from} route="/api/user/register/" method="register" />
      <p>Already have an account?</p>
      <button className='register-button' onClick={() => navigateTo('/login')}>Login</button>
    </div>
  )
}
