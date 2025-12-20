import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';

// Partilhar a informação do usuário pela aplicação
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await api.get('/user');
                setUser(response.data);
            }catch (error) {
                console.log(error);
                localStorage.removeItem('auth_token');
                delete api.defaults.headers.common['Authorization'];
                setUser(null);
            }
        }
        setLoading(false);
    }

    const updateAuthState = (token, userData) => {
        localStorage.setItem('auth_token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    };

    const clearAuthState = () => {
        localStorage.removeItem('auth_token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    }

    const logout = async () => {
        // Não assumimos que exista endpoint /logout; o essencial é limpar estado local.
        clearAuthState();
    }

    return (
        <AuthContext.Provider value={{ user, updateAuthState, loading, checkAuth, clearAuthState, logout }}>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);