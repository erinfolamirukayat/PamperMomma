'use server';
import { cookies, headers } from 'next/headers';
import { ActionStateType } from './types';
import { parseErrorText } from '../../helper';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const login = async (prevState: any, formData: FormData | null): Promise<ActionStateType<string>> => {
    const email = formData?.get('email') as string;
    const password = formData?.get('password') as string;
    try {
        console.log('Base URL:', API_BASE_URL);
        const cookieStore = await cookies();
        const response = await fetch(`${API_BASE_URL}/api-auth/basic/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Login error:', errorText);
            return {
                status: 'error',
                error: {
                    message: 'Failed to login',
                    code: response.status,
                    details: parseErrorText(errorText),
                }
            }
        }

        const data = await response.json();
        // cookieStore.set('access_token', data.access_token);
        cookieStore.set('refresh_token', data.refresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
        cookieStore.set('access_token', data.access, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
        return {
            status: 'success',
            data: data.access,
        };
    } catch (error) {
        console.error('Login failed:', error);
        return {
            status: 'error',
            error: {
                message: 'Login failed',
                code: 500,
                details: ['An unexpected error occurred'],
            }
        };
    }
}

export const retrieveAccessToken = async (): Promise<ActionStateType<string>> => {
    console.log('Retrieving access token...');
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;
    try {
        if (!refreshToken) {
            return {
                status: 'error',
                error: {
                    message: 'No refresh token found',
                    code: 401,
                    details: ['Unauthorized access'],
                }
            };
        }

        const response = await fetch(`${API_BASE_URL}/api-auth/basic/login/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error retrieving access token:', errorText);
            return {
                status: 'error',
                error: {
                    message: 'Failed to retrieve access token',
                    code: response.status,
                    details: parseErrorText(errorText),
                }
            };
        }

        const data = await response.json();
        cookieStore.set('access_token', data.access, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
        console.log('Access token retrieved:', data.access);
        return {
            status: 'success',
            data: data.access,
        };
    } catch (error) {
        console.error('Error retrieving access token:', error);
        return {
            status: 'error',
            error: {
                message: 'Error retrieving access token',
                code: 500,
                details: ['An unexpected error occurred']
            }
        };
    }
}

export const logout = async (prevState: any, formData: FormData | null): Promise<ActionStateType<void>> => {
    const cookieStore = await cookies();
    console.log('Logging out...');
    cookieStore.delete('refresh_token');
    cookieStore.delete('access_token');
    return {
        status: 'success',
        data: undefined
    };
};