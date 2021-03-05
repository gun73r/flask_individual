import Api from './index';

class AgreementService {
    constructor() {
        this.api = new Api('/agreements');
    }

    create(agreement) {
        return this.api.post(agreement);
    }
    delete(id) {
        return this.api.delete({id});
    }
    update(agreement) {
        return this.api.put(agreement);
    }
    get(params) {
        return this.api.get(params);
    }
}

export default new AgreementService();
