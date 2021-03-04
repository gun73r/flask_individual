import axios from 'axios';

const instance = axios.create({ baseURL: 'http://localhost:5000' });


export default class Api {
    get(path, params) {
        const auth = localStorage.getItem('auth_token');
        const response = instance.get(path, {
            params,
            'headers': {
                'authorization': auth
            }
        })
            .then(response => {
                return {
                    status: response.status,
                    data: response.data
                };
            })
            .catch(err => {
                if (err.response.status == 401) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                }
                return null;
            });
        return response;
    }

    post(path, data) {
        const auth = localStorage.getItem('auth_token');
        const response = instance.post(path, data, {
            headers: {
                'authorization': auth
            }
        })
            .then(result => {
                return {
                    status: result.status,
                    data: result.data
                };
            })
            .catch(err => {
                console.log(err);
                if (err.response.status == 401) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                }
                return null;
            });
        return response;
    }

    put(path, data) {
        const auth = localStorage.getItem('auth_token');
        const response = instance.put(path, data, {
            headers: {
                'authorization': auth
            }
        })
            .then(result => {
                return {
                    status: result.status,
                    data: result.data
                };
            })
            .catch(err => {
                if (err.response.status == 401) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                }
                return null;
            });
        return response;
    }

    delete(path, data) {
        const auth = localStorage.getItem('auth_token');
        const response = instance.put(path, data, {
            headers: {
                'authorization': auth
            }
        })
            .then(result => {
                return {
                    status: result.status,
                    data: result.data
                };
            })
            .catch(err => {
                if (err.response.status == 401) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                }
                return null;
            });
        return response;

    }
}
