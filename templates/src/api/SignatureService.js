import Api from './index';

class SignatureService {
    constructor() {
        this.api = new Api('/signatures');
    }

    get(params) {
        return this.api.get(params);
    }

    create(signature) {
        return this.api.post(signature);
    }

    delete(data) {
        return this.api.delete(data);
    }
}

export default new SignatureService();
