import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [token, setToken] = useState();
    const [userId, setUserId] = useState();

    const navigate = useNavigate();

    const login = useCallback((token, userId) => {

        setToken(token);
        setUserId(userId);

        localStorage.setItem(
            'chat-app-user-details',
            JSON.stringify({
                token: token,
                userId: userId
            })
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem('chat-app-user-details');

        navigate('/');
    }, []);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('chat-app-user-details'));
        if (storedData && storedData.token) {
            login(storedData.token, storedData.userId);
        }
    }, [login]);

    return { token, userId, login, logout };
};