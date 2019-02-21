import { authHeader } from '../helpers/auth-header';
import axios from 'axios';

export const userService = {
    login,
    logout,
    getAll,
    updateProfile
};

async function updateProfile(id, data) {
    return await axios.put(
        `${process.env.REACT_APP_REST_API}users/${id}`,
        { ...data },
        { headers: authHeader() }
    )
}

async function login(email: string, password: string) {
    const response = await axios.post(
        `${process.env.REACT_APP_REST_API}users/login`, {
            email,
            password
        }
    )
    const { token } = response.data
    sessionStorage.setItem('token', token)
}

function logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader() as any
    };

    return fetch(`${process.env.REACT_APP_REST_API}/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}