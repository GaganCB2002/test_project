import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token') || localStorage.getItem('token');
        
        if (urlToken) {
            try {
                const payload = JSON.parse(atob(urlToken.split('.')[1]));
                const role = (payload.role || '').toUpperCase();
                const allowed = ['CEO', 'ADMIN', 'HR', 'LEAD', 'TECH_LEAD'];
                
                if (!allowed.includes(role)) {
                    console.error('Access Denied: Role Unauthorized');
                    window.location.href = 'http://127.0.0.1:3005/login?error=Access%20Denied';
                    return;
                }

                const userData = { 
                    name: payload.name || 'Secure User', 
                    role: role,
                    email: payload.email 
                };
                
                setToken(urlToken);
                setUser(userData);
                localStorage.setItem('token', urlToken);
                localStorage.setItem('user', JSON.stringify(userData));
            } catch (e) {
                console.error('Invalid Protocol Token');
                localStorage.removeItem('token');
            }
            
            // Clean URL
            if (params.get('token')) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, []);

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
