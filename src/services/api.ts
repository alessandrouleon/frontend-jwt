
import { signOut } from "@/contexts/AuthContext";
import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

interface AxiosErrorResponse {
    code?: string;
}

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue = [];


export const api = axios.create({
    baseURL: 'http://192.168.0.17:3333',
    headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}`
    }
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError<AxiosErrorResponse>) => {
        if (error.response.status === 401) {
            if (error.response.data?.code === 'token.expired') {
                cookies = parseCookies();

                const { 'nextauth.refreshToken': refreshToken } = cookies;
                const originalConfig = error.config;

                if (!isRefreshing) {
                    isRefreshing = true;
                    api.post('/refresh', { refreshToken })
                        .then((response) => {
                            const { token } = response.data;

                            setCookie(undefined, 'nextauth.token', token, {
                                maxAge: 60 * 60 * 24 * 30,
                                path: '/'
                            });
                            setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
                                maxAge: 60 * 60 * 24 * 30,
                                path: '/'
                            });

                            api.defaults.headers['Authorization'] = `Bearer ${token}`;
                    
                            failedRequestsQueue.forEach(request => request.onSuccess(token));
                            failedRequestsQueue = [];
                        }).catch(err => {
                            failedRequestsQueue.forEach(request => request.onFailure(err));
                            failedRequestsQueue = [];
                        }).finally(() => {
                            isRefreshing = false;
                        });
                }
                return new Promise((resolve, rejects) => {
                    failedRequestsQueue.push({
                        onSuccess: (token: string) => {
                            originalConfig.headers['Authorization'] = `Bearer ${token}`
                            resolve(api(originalConfig));
                        },
                        onFailure: (err: AxiosError) => {
                            rejects(err);
                        }
                    })
                });
            }
           
        }
        else {
              signOut();
           }
        return Promise.reject(error);
    });