import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = (socket) => {
    const [token, setToken] = useState();
    const [userId, setUserId] = useState();

    const navigate = useNavigate();

    const login = useCallback((token, userId) => {
        if (!socket)
            return;

        setToken(token);
        setUserId(userId);

        localStorage.setItem(
            'chat-app-user-details',
            JSON.stringify({
                token: token,
                userId: userId
            })
        );

        socket.emit("user-active", { userId: userId });
    }, []);

    const logout = useCallback(() => {
        const userId$ = userId;
        setToken(null);
        setUserId(null);
        localStorage.removeItem('chat-app-user-details');

        socket.emit("user inactive", { userId: userId$ });

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