import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null;  user: { id: string, name: string, email: string } | null; };
    onRegister?: (name: string, email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';
export const API_URL = 'http://192.168.15.7:5000/api';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: any) => {
    
    const [authState, setAuthState] = useState<{
        token: string | null,
        authenticated: boolean | null,
        user: { name: string, email: string } | null
    }>({
        token: null,
        authenticated: null,
        user: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const userString = await SecureStore.getItemAsync('USER_INFO');
            const user = userString ? JSON.parse(userString) : null;
            console.log("stored:", token)
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setAuthState({
                    token: token,
                    authenticated: true,
                    user: user
                });
            }
        }
        loadToken();
    }, [])

    const register = async (name: string, email: string, password: string) => {
        try {
            console.log(name, email, password)
            return await axios.post(`${API_URL}/register`, { name, email, password });
    } catch (e) {
        console.log("error", e)
        return { error: true, msg: (e as any).response.data.msg };    
    }
    };

    const login = async (email: string, password: string) => {
        try {
            const result =  await axios.post(`${API_URL}/auth`, { email, password });

            console.log("file: AuthContext.tsx:41 ~ login ~ result:", result)

            setAuthState({
                token: result.data.token,
                authenticated: true,
                user: result.data.user
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token)
            await SecureStore.setItemAsync('USER_INFO', JSON.stringify(result.data.user));

            return result;

    } catch (e) {
        return { error: true, msg: (e as any).response.data.msg };    
    }
    };

    const logout = async () => {
        // Delete token from storage
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync('USER_INFO');

        // Update HTTP Headers
        axios.defaults.headers.common['Authorization'] = '';

        // Reset auth state
        setAuthState({
            token: null,
            authenticated: false,
            user: null
        })
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}