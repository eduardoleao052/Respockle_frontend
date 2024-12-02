import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import "../styles/Form.css"

export default function Form({ route, method, url }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigateTo = useNavigate()

    useEffect(() => {
        console.log(url)
      },[])

    const name = method === "login" ? "Login" : "Register" 

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const res = await api.post(route, {username, password});
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigateTo(url, { replace: true })
            } else if (method === "register") {
                const loginRes = await api.post("/api/token/", { username, password });
        
                localStorage.setItem(ACCESS_TOKEN, loginRes.data.access);
                localStorage.setItem(REFRESH_TOKEN, loginRes.data.refresh);

                await api.post(`/api/user/profile/create/${res.data.id}/`, {})
                    .then((profileRes) => console.log(profileRes.data))
                    .catch((error) => console.error(error));

                navigateTo("/")
            }
        } catch(error) {
            alert(error);
        } finally {
            setLoading(false)
        }
        e.preventDefault()
    }

    return(
        <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        <input 
            className="form-input"
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username" />
        <input 
            className="form-input"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" />
        <button className='form-button' type='submit'>{name}</button>

    </form>)

}

