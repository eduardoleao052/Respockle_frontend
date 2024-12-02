import Form from '../components/Form'
import '../styles/Login.css'
import {useLocation,useNavigate} from  'react-router-dom'

export default function Login() {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const navigateTo = useNavigate(); 

  return (
    <div style={{textAlign: "center", width: "100%", marginTop: "140px"}}>
      <Form url={from} route="/api/token/" method="login" />
      <p>Don't have an account?</p>
      <button className='register-button' onClick={() => navigateTo('/register')}>Register</button>
    </div>
  )
}
