import axios from 'axios';

const endpoint = 'http://localhost:5000';

export function get(path, params) {
    const auth = localStorage.getItem('auth_token');
    return axios(endpoint + path, { 
        params,
        method: 'GET',
        headers: {
            'authorization': auth
        },
    })
        .then(result => {
            return {
                status: result.status,
                data: result.data
            };
        });
}

export function post(path, data) {
    const auth = localStorage.getItem('auth_token');
    return axios(endpoint + path, { 
        data,
        method: 'POST',
        headers: {
            'authorization': auth
        }
    })
        .then(result => {
            return {
                status: result.status,
                data: result.data
            };
        });
}

export function put(path, data) {
    const auth = localStorage.getItem('auth_token');
    return axios(endpoint + path, { 
        data,
        method: 'PUT',
        headers: {
            'authorization': auth
        }
    })
        .then(result => {
            return {
                status: result.status,
                data: result.data
            };
        });
}

export function del(path, data) {
    const auth = localStorage.getItem('auth_token');
    return axios.delete(endpoint + path, { 
        data,
        method: 'DELETE',
        headers: {
            'authorization': auth
        }
    })
        .then(result => {
            return {
                status: result.status,
                data: result.data
            };
        });
}