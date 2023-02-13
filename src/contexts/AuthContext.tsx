
import { api } from "@/services/apiClient";
import { createContext, ReactNode, useEffect, useState } from "react";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from 'nookies';

type User = {
    email: string;
    permissions: string[];
    roles: string[];
}

type SignInCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signOut: () => void;
    user: User;
    isAuthenticated: boolean;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

// Connection to a broadcast channel
let authChannel: BroadcastChannel;

export function signOut() {
    destroyCookie(undefined, 'nextauth.token');
    destroyCookie(undefined, 'nextauth.refreshToken');

     authChannel.postMessage('signOut');

    Router.push('/');
};


export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;

    useEffect(() => {
        // Connection to a broadcast channel
        authChannel = new BroadcastChannel('auth');
        authChannel.onmessage = (message) => {
            switch (message.data) {
                case 'signOut':
                default:
                    break;
            }
        }
    }, []);

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies();
        if (token) {
            api.get('/me').then(response => {
                const { email, permissions, roles } = response.data;
                setUser({ email, permissions, roles });
            })
                .catch(() => {
                    signOut();
                });
        }
    }, []);

    const signIn = async ({ email, password }: SignInCredentials) => {
        try {
            const response = await api.post('/sessions', {
                email,
                password
            });

            const { token, refreshToken, permissions, roles } = response.data;

            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            });
            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            });
            setUser({
                email,
                permissions,
                roles
            });

            api.defaults.headers['Authorization'] = `Bearer${token}`;

            Router.push('/dashboard');

        } catch (err) {
            console.log(err);
        }

    };

    return (
        <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    );
}