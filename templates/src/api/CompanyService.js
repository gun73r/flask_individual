import Api from './index';

class CompanyService {
    constructor() {
        this.api = new Api('/companies');
    }

    create(company) {
        return this.api.post(company);
    }
    get(params) {
        return this.api.get(params);
    }
}

export default new CompanyService();
