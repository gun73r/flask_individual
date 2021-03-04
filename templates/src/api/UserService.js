import Api from './index';

export default class userService {
    constructor() {
        this.api = new Api();
        this.path = '/api/users';
    }

    create(user) {
        return this.api.post(this.path, user);
    }
    delete(id) {
        return this.api.delete(this.path, {id});
    }
    update(user) {
        return this.api.put(this.path, user);
    }
    get(params) {
        return this.api.get(this.path, params);
    }
}
