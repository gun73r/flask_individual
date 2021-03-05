import axios from 'axios';

const instance = axios.create({ baseURL: 'http://localhost:5000/api' });


export default class Api {
    constructor(path) {
        this.path = path;
    }
    get(params) {
        const auth = localStorage.getItem('auth_token');
        const response = instance.get(this.path, {
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

    post(data) {
        const auth = localStorage.getItem('auth_token');
        const response = instance.post(this.path, data, {
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

    put(data) {
        const auth = localStorage.getItem('auth_token');
        const response = instance.put(this.path, data, {
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

    delete(data) {
        const auth = localStorage.getItem('auth_token');
        const response = instance.delete(this.path, {data,
            headers: {
                'authorization': auth,

            }
        })
            .then(result => {
                return {
                    status: result.status,
                    data: result.data
                };
            })
            .catch(err => {
                console.log(err.response);
                if (err.response.status == 401) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                }
                return null;
            });
        return response;

    }
}
