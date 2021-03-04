import Api from './index';

export default class CompanyService {
    constructor() {
        this.api = new Api();
        this.path = '/api/companies';
    }

    create(company) {
        return this.api.post(this.path, company);
    }
    get(params) {
        return this.api.get(this.path, params);
    }
}
