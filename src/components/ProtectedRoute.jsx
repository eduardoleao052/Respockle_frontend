import {Navigate, useLocation} from  'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import api from '../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants'
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {

    const [isAuthorized, setIsAuthorized] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Se houver qualquer erro, da Set em Authorized para false:
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const token = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/api/token/refresh/", {refresh: token,});
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            }
        } catch(error) {
            console.log(error);
            setIsAuthorized(false);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false);
            return
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" state={{ from: location }} />;

}