import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const initialState = {
    user: null,
    token: localStorage.getItem('agri_token') || null,
    loading: true,
};

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
        case 'LOGOUT':
            return { ...state, user: null, token: null, loading: false };
        case 'SET_USER':
            return { ...state, user: action.payload, loading: false };
        case 'LOADING_DONE':
            return { ...state, loading: false };
        default:
            return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // On app load, verify token and fetch user profile
    useEffect(() => {
        const token = localStorage.getItem('agri_token');
        if (!token) {
            dispatch({ type: 'LOADING_DONE' });
            return;
        }
        api.get('/auth/me')
            .then(res => dispatch({ type: 'SET_USER', payload: res.data }))
            .catch(() => {
                localStorage.removeItem('agri_token');
                dispatch({ type: 'LOGOUT' });
            });
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('agri_token', data.token);
        // Fetch full user profile after login
        const me = await api.get('/auth/me');
        dispatch({ type: 'LOGIN', payload: { token: data.token, user: me.data } });
        return me.data;
    };

    const signup = async (email, password, fullName) => {
        await api.post('/auth/signup', { email, password, fullName });
    };

    const logout = () => {
        localStorage.removeItem('agri_token');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, signup, logout, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
