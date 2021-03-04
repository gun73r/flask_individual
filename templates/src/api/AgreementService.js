import Api from './index';

export default class AgreementService {
    constructor() {
        this.api = new Api();
        this.path = '/api/agreements';
    }

    create(agreement) {
        return this.api.post(this.path, agreement);
    }
    delete(id) {
        return this.api.delete(this.path, {id});
    }
    update(agreement) {
        return this.api.put(this.path, agreement);
    }
    get(params) {
        return this.api.get(this.path, params);
    }
}
