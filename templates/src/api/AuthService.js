import Api from './index';

class AuthService {
    constructor() {
        this.api = new Api('/auth');
    }

    login(username) {
        return this.api.post(username);
    }
    get() {
        return this.api.get();
    }
}

export default new AuthService();
