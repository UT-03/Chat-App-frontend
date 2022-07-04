import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import SocketContext from './context/SocketContext';
import AuthContext from './context/AuthContext';
import { useAuth } from './hooks/AuthHook';
import Header from './components/Header';

const App = () => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    setSocket(io(process.env.REACT_APP_BACKEND_URL));
  }, []);

  const { token, userId, login, logout } = useAuth();

  useEffect(() => {
    if (!!token && socket) {
      socket.emit('user active', { userId: userId });
    }
  }, [socket, token]);

  return (
    <React.Fragment>
      {socket && (
        <SocketContext.Provider
          value={{
            socket: socket
          }}>
          <AuthContext.Provider
            value={{
              isLoggedIn: !!token,
              token: token,
              userId: userId,
              login: login,
              logout: logout
            }}
          >
            <Header />
            <Routes>
              {!!token ? (
                <React.Fragment>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                </React.Fragment>
              ) : (
                <Route path="*" element={<Auth />} />
              )}
            </Routes>
          </AuthContext.Provider>
        </SocketContext.Provider>
      )}
    </React.Fragment>
  );
};

export default App;