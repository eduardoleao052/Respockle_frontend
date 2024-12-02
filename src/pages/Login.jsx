import Form from '../components/Form'
import '../styles/Login.css'
import {useLocation} from  'react-router-dom'

export default function Login() {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'; 

  return (
    <div style={{textAlign: "center", width: "100%", marginTop: "140px"}}>
      <Form url={from} route="/api/token/" method="login" />
      <p>Don't have an account?</p>
      <a href="/register"><button className='register-button'>Register</button></a>
    </div>
  )
}
