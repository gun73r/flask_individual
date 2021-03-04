import Api from './index';

export default class AuthService {
    constructor() {
        this.api = new Api();
        this.path = '/api/auth';
    }

    login(username) {
        return this.api.post(this.path, username);
    }
    get() {
        return this.api.get(this.path);
    }
}
