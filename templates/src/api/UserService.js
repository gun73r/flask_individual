import Api from './index';

class UserService {
    constructor() {
        this.api = new Api('/users');
    }

    create(user) {
        return this.api.post(user);
    }
    delete(id) {
        return this.api.delete({id});
    }
    update(user) {
        return this.api.put(user);
    }
    get(params) {
        return this.api.get(params);
    }
}

export default new UserService();
