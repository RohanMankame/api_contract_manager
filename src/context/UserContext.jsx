import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const res = await authService.getProtected();
                if (res.data?.data?.user) {
                    setUser(res.data.data.user);
                } else if (res.data?.data?.full_name) {
                    // Fallback: sometimes data IS the user object
                    setUser(res.data.data);
                }
            }
        } catch (err) {
            console.error('Failed to fetch user', err);
            // Optional: Handle token expiration or invalidity here if needed
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, refreshUser: fetchUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
